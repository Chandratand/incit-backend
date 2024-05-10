import axios from 'axios';
import bcrypt from 'bcrypt';
import { Request } from 'express';
import { google } from 'googleapis';
import { db } from '../../db';
import { BadRequestError, InternalServerError, UnauthenticatedError, UnauthorizedError } from '../../lib/errors';
import { ResetPasswordValidator, SignInValidator, SignUpValidator } from '../../lib/validator/auth';
import { UpdateProfileValidator } from '../../lib/validator/profile';
import { AuthUser } from '../../types';
import { oauth2Client } from '../../utils/googleApi';
import { createJWT } from '../../utils/jwt';
import EmailSercive from '../email/service';

const SignUp = async (req: Request) => {
  const { password, email, name } = SignUpValidator.parse(req.body);
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      signUpMethod: 'Email',
    },
  });

  const formattedUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    isVerified: user.isVerified,
    signUpMethod: user.signUpMethod,
  };

  await EmailSercive.sendEmailVerification(user.email);
  const token = createJWT(formattedUser);
  return { token: token, user: formattedUser };
};

const SignIn = async (req: Request) => {
  const { password, email } = SignInValidator.parse(req.body);
  const user = await db.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user || !user.password) throw new UnauthorizedError('Invalid Credentials');
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new UnauthorizedError('Invalid Credentials');
  const formattedUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    isVerified: user.isVerified,
    signUpMethod: user.signUpMethod,
  };

  await db.user.update({
    where: {
      email: email,
    },
    data: {
      logInCount: user.logInCount + 1,
      lastActive: new Date(),
    },
  });

  const token = createJWT(formattedUser);
  return { token: token, user: formattedUser };
};

const resetPassword = async (req: Request, authUser: AuthUser) => {
  const { oldPassword, newPassword } = ResetPasswordValidator.parse(req.body);
  const { email } = authUser;

  const user = await db.user.findUnique({ where: { email: email } });
  if (!user || !user.password) {
    throw new UnauthorizedError('Unauthenticated');
  }

  // Verify the old password
  const isOldPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
  if (!isOldPasswordCorrect) {
    throw new UnauthenticatedError('Old password is incorrect');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await db.user.update({
    where: { email: email },
    data: { password: hashedPassword },
  });
  return true;
};

const updateProfile = async (req: Request, authUser: AuthUser) => {
  const { name } = UpdateProfileValidator.parse(req.body);
  const { email } = authUser;

  const user = await db.user.findUnique({ where: { email: email } });
  if (!user) {
    throw new UnauthorizedError('Unauthenticated');
  }

  const updatedUser = await db.user.update({
    where: { email: email },
    data: { name: name },
    select: {
      id: true,
      name: true,
      email: true,
      isVerified: true,
      signUpMethod: true,
    },
  });
  return updatedUser;
};

const processUserOAuth2 = async (userData: { name: string; email: string; signUpMethod: string }) => {
  let user = await db.user.findUnique({
    where: {
      email: userData.email,
    },
  });

  if (!user) {
    user = await db.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        signUpMethod: userData.signUpMethod,
        isVerified: true,
        logInCount: 1,
        lastActive: new Date(),
      },
    });
  } else {
    await db.user.update({
      where: {
        email: userData.email,
      },
      data: {
        logInCount: user.logInCount + 1,
        lastActive: new Date(),
      },
    });
  }

  const payload = {
    id: user.id,
    name: user.name,
    email: user.email,
    isVerified: user.isVerified,
    signUpMethod: user.signUpMethod,
  };

  return payload;
};

const googleAuthCallback = async (req: Request) => {
  const { code } = req.query;

  const { tokens } = await oauth2Client.getToken(code as string);

  oauth2Client.setCredentials(tokens);

  const oauth2 = google.oauth2({
    auth: oauth2Client,
    version: 'v2',
  });

  const { data } = await oauth2.userinfo.get();

  if (!data.email || !data.name) {
    throw new UnauthenticatedError('Unauthenticated');
  }

  let user = await db.user.findUnique({
    where: {
      email: data.email,
    },
  });

  const payload = await processUserOAuth2({ name: data.name, email: data.email, signUpMethod: 'Google' });

  const token = createJWT(payload);
  return { token: token, user: payload };
};

const facebookAuthCallback = async (req: Request) => {
  const { code } = req.query;
  const tokenUrl = `https://graph.facebook.com/v13.0/oauth/access_token?client_id=${process.env.FACEBOOK_APP_ID}&redirect_uri=${encodeURIComponent(`${process.env.BASE_URL}auth/facebook/callback`)}&client_secret=${
    process.env.FACEBOOK_APP_SECRET
  }&code=${code}`;

  const response = await axios.get(tokenUrl);
  const accessToken = response.data.access_token;

  const { data } = await axios.get(`https://graph.facebook.com/me?fields=id,name,email&access_token=${accessToken}`);

  const payload = await processUserOAuth2({ name: data.name, email: data.email, signUpMethod: 'Facebook' });
  const token = createJWT(payload);
  return { token: token, user: payload };
};

const checkVerifiedEmail = async (req: Request, authUser: AuthUser) => {
  const { email } = authUser;
  const user = await db.user.findUnique({
    where: {
      email: email,
    },
  });
  if (!user) throw new BadRequestError('Invalid User');
  const formattedUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    isVerified: user.isVerified,
    signUpMethod: user.signUpMethod,
  };

  const token = createJWT(formattedUser);
  return { token: token, user: formattedUser };
};

const resendEmailVerification = async (req: Request, authUser: AuthUser) => {
  const { email } = authUser;
  const res = await EmailSercive.sendEmailVerification(email);
  if (!res) throw new InternalServerError('Send Email fail!');
  return !!res;
};

const AuthService = {
  SignUp,
  SignIn,
  resetPassword,
  updateProfile,
  googleAuthCallback,
  facebookAuthCallback,
  checkVerifiedEmail,
  resendEmailVerification,
};

export default AuthService;
