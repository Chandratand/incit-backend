import { Request } from 'express';
import { SignInValidator, SignUpValidator } from '../../lib/validator/auth';
import bcrypt from 'bcrypt';
import { db } from '../../db';
import { UnauthorizedError } from '../../lib/errors';
import { createJWT } from '../../utils/jwt';

const SignUp = async (req: Request) => {
  const { password, email, name } = SignUpValidator.parse(req.body);
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
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
    name: user.name,
    email: user.email,
    isVerified: user.isVerified,
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

const AuthService = {
  SignUp,
  SignIn,
};

export default AuthService;
