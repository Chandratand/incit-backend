import bcrypt from 'bcrypt';
import { Request } from 'express';
import { db } from '../../db';
import { UnauthenticatedError, UnauthorizedError } from '../../lib/errors';
import { ResetPasswordValidator, SignInValidator, SignUpValidator } from '../../lib/validator/auth';
import { createJWT } from '../../utils/jwt';
import { AuthUser } from '../../types';
import { UpdateProfileValidator } from '../../lib/validator/profile';
import { google } from 'googleapis';
import { oauth2Client } from '../../utils/googleApi';

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
  return user;
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

  if (!user) {
    user = await db.user.create({
      data: {
        name: data.name,
        email: data.email,
        signUpMethod: 'Google',
        isVerified: true,
        logInCount: 1,
        lastActive: new Date(),
      },
    });
  }
  await db.user.update({
    where: {
      email: data.email,
    },
    data: {
      logInCount: user.logInCount + 1,
      lastActive: new Date(),
    },
  });

  const payload = {
    id: user.id,
    name: user.name,
    email: user.email,
    isVerified: user.isVerified,
    signUpMethod: user.signUpMethod,
  };

  const token = createJWT(payload);
  return { token: token, user: payload };
};

const AuthService = {
  SignUp,
  SignIn,
  resetPassword,
  updateProfile,
  googleAuthCallback,
};

export default AuthService;
