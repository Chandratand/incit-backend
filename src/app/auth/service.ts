import axios from 'axios';
import bcrypt from 'bcrypt';
import { Request } from 'express';
import { db } from '../../db';
import { BadRequestError, InternalServerError, UnauthenticatedError, UnauthorizedError } from '../../lib/errors';
import { ResetPasswordValidator, SignInValidator, SignUpValidator } from '../../lib/validator/auth';
import { UpdateProfileValidator } from '../../lib/validator/profile';
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

  // set default logout at 24h from now because jwt exp
  const logOutAt = new Date();
  logOutAt.setHours(logOutAt.getHours() + 24);

  await db.user.update({
    where: {
      email: email,
    },
    data: {
      logInCount: user.logInCount + 1,
      lastActive: new Date(),
      logOutAt: logOutAt,
    },
  });

  const token = createJWT(formattedUser);
  return { token: token, user: formattedUser };
};

const signOut = async (req: Request) => {
  const email = req.user?.email;

  await db.user.update({
    where: {
      email: email,
    },
    data: {
      logOutAt: new Date(),
    },
  });

  return true;
};

const resetPassword = async (req: Request) => {
  const { oldPassword, newPassword } = ResetPasswordValidator.parse(req.body);
  const email = req.user?.email;

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

const updateProfile = async (req: Request) => {
  const { name } = UpdateProfileValidator.parse(req.body);
  const email = req.user?.email;

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
    // set default logout at 24h from now because jwt exp
    const logOutAt = new Date();
    logOutAt.setHours(logOutAt.getHours() + 24);

    await db.user.update({
      where: {
        email: userData.email,
      },
      data: {
        logInCount: user.logInCount + 1,
        lastActive: new Date(),
        logOutAt: logOutAt,
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

const googleVefrifyId = async (req: Request) => {
  const { idToken } = req.body;

  if (!idToken) throw new BadRequestError('Bad Request Error');

  const ticket = await oauth2Client.verifyIdToken({
    idToken: idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const data = ticket.getPayload();
  if (!data?.name || !data?.email) throw new BadRequestError('Bad Request Error');
  const payload = await processUserOAuth2({ name: data.name, email: data.email, signUpMethod: 'Google' });
  const token = createJWT(payload);
  return {
    token: token,
    user: payload,
  };
};

const facebookVefrifyId = async (req: Request) => {
  const { idToken } = req.body;
  const res = await axios.get(`https://graph.facebook.com/v13.0/me?fields=id,name,email,picture&access_token=${idToken}`);

  if (!res.data?.name || !res.data?.email) throw new BadRequestError('Bad Request Error');

  const payload = await processUserOAuth2({ name: res.data.name, email: res.data.email, signUpMethod: 'Google' });
  const token = createJWT(payload);
  return {
    token: token,
    user: payload,
  };
};

const checkVerifiedEmail = async (req: Request) => {
  const email = req.user?.email;
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

const resendEmailVerification = async (req: Request) => {
  const email = req.user?.email as string;
  const res = await EmailSercive.sendEmailVerification(email);
  if (!res) throw new InternalServerError('Send Email fail!');
  return !!res;
};

const AuthService = {
  SignUp,
  SignIn,
  resetPassword,
  updateProfile,
  checkVerifiedEmail,
  resendEmailVerification,
  googleVefrifyId,
  facebookVefrifyId,
  signOut,
};

export default AuthService;
