import jwt, { JwtPayload } from 'jsonwebtoken';
interface TokenBody extends JwtPayload {
  id: number;
  name: string;
  email: string;
  isVerified: boolean;
  signUpMethod?: string | null;
}

export const createJWT = (payload: TokenBody): string => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error('JWT_SECRET is not defined in the environment variables');
  }

  const token = jwt.sign(payload, jwtSecret, {
    expiresIn: '24h',
  });

  return token;
};

export const isTokenValid = (token: string): TokenBody => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error('JWT_SECRET is not defined in the environment variables');
  }

  return jwt.verify(token, jwtSecret) as TokenBody;
};

export const createEmailVerifToken = (email: string): string => {
  const jwtSecret = process.env.JWT_EMAIL_SECRET;
  if (!jwtSecret) {
    throw new Error('JWT_SECRET is not defined in the environment variables');
  }

  const token = jwt.sign({ email }, jwtSecret, {
    expiresIn: '10m',
  });

  return token;
};

export const isEmailTokenValid = (token: string): TokenBody => {
  const jwtSecret = process.env.JWT_EMAIL_SECRET;
  if (!jwtSecret) {
    throw new Error('JWT_SECRET is not defined in the environment variables');
  }
  return jwt.verify(token, jwtSecret) as TokenBody;
};
