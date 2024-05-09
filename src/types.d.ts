// types.d.ts or inside your existing TypeScript definition file

import { Request } from 'express';

declare global {
  namespace Express {
    export interface User {
      email: string;
      name: string;
      isVerified: boolean;
    }

    export interface Request {
      user?: User;
    }
  }
}
