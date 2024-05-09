import { JwtPayload } from 'jsonwebtoken';

export interface AuthUser extends JwtPayload {
  id: number;
  email: string;
  name: string;
  isVerified: boolean;
  signUpMethod?: string;
}
