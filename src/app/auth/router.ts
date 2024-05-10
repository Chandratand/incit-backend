import express from 'express';
import { checkVerificationStatus, facebookVerifyToken, googleVerifyToken, resendEmailVerification, resetPassword, signIn, signOut, signUp, updateProfile } from './controller';

const AuthRouter = express();
AuthRouter.post('/sign-up', signUp);
AuthRouter.post('/sign-in', signIn);
AuthRouter.post('/reset-password', resetPassword);
AuthRouter.put('/profile', updateProfile);
AuthRouter.post('/google/verify', googleVerifyToken);
AuthRouter.post('/facebook/verify', facebookVerifyToken);
AuthRouter.get('/verification-status', checkVerificationStatus);
AuthRouter.post('/resend-email', resendEmailVerification);
AuthRouter.post('/sign-out', signOut);

export default AuthRouter;
