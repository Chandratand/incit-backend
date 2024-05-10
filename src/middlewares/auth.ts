import { NextFunction, Request, Response } from 'express';
import { UnauthenticatedError } from '../lib/errors';
import { isTokenValid } from '../utils/jwt';

const authenticate = (requireVerification: boolean) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      let token;

      console.log('first');
      // check header
      const authHeader = req.headers.authorization;

      if (authHeader && authHeader.startsWith('Bearer')) {
        token = authHeader.split(' ')[1];
      }

      if (!token) {
        throw new UnauthenticatedError('Unauthenticated');
      }

      const payload = isTokenValid(token);

      if (requireVerification && !payload.isVerified) {
        throw new UnauthenticatedError('Unauthenticated');
      }

      // Attach the user and his permissions to the req object
      req.user = {
        id: payload.id,
        email: payload.email,
        name: payload.name,
        isVerified: payload.isVerified,
      };

      next();
    } catch (error) {
      next(error);
    }
  };
};

export const authenticateUser = authenticate(true);
export const unverifiedAuthenteUser = authenticate(false);
