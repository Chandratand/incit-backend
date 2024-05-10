import express from 'express';
import { checkVerificationStatus, facebookAuth, facebookAuthCallback, googleAuth, googleAuthCallback, resendEmailVerification, resetPassword, signIn, signUp, updateProfile } from './controller';

const AuthRouter = express();
AuthRouter.post('/sign-up', signUp);
AuthRouter.post('/sign-in', signIn);
AuthRouter.post('/reset-password', resetPassword);
AuthRouter.put('/profile', updateProfile);
AuthRouter.get('/google', googleAuth);
AuthRouter.get('/google/callback', googleAuthCallback);
AuthRouter.get('/facebook', facebookAuth);
AuthRouter.get('/facebook/callback', facebookAuthCallback);
AuthRouter.get('/verification-status', checkVerificationStatus);
AuthRouter.post('/resend-email', resendEmailVerification);

export default AuthRouter;
