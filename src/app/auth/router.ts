import express from 'express';
import { checkVerificationStatus, facebookVerifyToken, googleVerifyToken, resendEmailVerification, resetPassword, signIn, signOut, signUp, updateProfile } from './controller';
import { authenticateUser, unverifiedAuthenteUser } from '../../middlewares/auth';

const AuthRouter = express();
AuthRouter.post('/sign-up', signUp);
AuthRouter.post('/sign-in', signIn);
AuthRouter.post('/reset-password', authenticateUser, resetPassword);
AuthRouter.put('/profile', authenticateUser, updateProfile);
AuthRouter.post('/google/verify', googleVerifyToken);
AuthRouter.post('/facebook/verify', facebookVerifyToken);
AuthRouter.get('/verification-status', unverifiedAuthenteUser, checkVerificationStatus);
AuthRouter.post('/resend-email', unverifiedAuthenteUser, resendEmailVerification);
AuthRouter.post('/sign-out', unverifiedAuthenteUser, signOut);

export default AuthRouter;
