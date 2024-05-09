import bcrypt from 'bcrypt';
import { Request } from 'express';
import { db } from '../../db';
import { UnauthenticatedError, UnauthorizedError } from '../../lib/errors';
import { ResetPasswordValidator, SignInValidator, SignUpValidator } from '../../lib/validator/auth';
import { createJWT } from '../../utils/jwt';
import { AuthUser } from '../../types';
import { UpdateProfileValidator } from '../../lib/validator/profile';

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

  if (!user) throw new UnauthorizedError('Invalid Credentials');
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
  if (!user) {
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

const AuthService = {
  SignUp,
  SignIn,
  resetPassword,
  updateProfile,
};

export default AuthService;
