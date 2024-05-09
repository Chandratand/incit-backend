import { NextFunction, Request, Response } from 'express';
import { UnauthenticatedError } from '../lib/errors';
import { isTokenValid } from '../utils/jwt';

const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    let token;
    // check header
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer')) {
      token = authHeader.split(' ')[1];
    }

    if (!token) {
      throw new UnauthenticatedError('Unauthenticated');
    }

    const payload = isTokenValid(token);

    if (!payload.isVerified) {
      throw new UnauthenticatedError('Unauthenticated');
    }

    // Attach the user and his permissions to the req object
    // req.user = {
    //   email: payload.email,
    //   name: payload.name,
    //   isVerified: payload.isVerified,
    // };
    return payload;

    // next();
  } catch (error) {
    // next(error);
    throw error;
  }
};

export default authenticateUser;
