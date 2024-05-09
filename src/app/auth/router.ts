import express from 'express';
import { facebookAuth, facebookAuthCallback, googleAuth, googleAuthCallback, resetPassword, signIn, signUp, updateProfile } from './controller';

const AuthRouter = express();
AuthRouter.post('/sign-up', signUp);
AuthRouter.post('/sign-in', signIn);
AuthRouter.post('/reset-password', resetPassword);
AuthRouter.put('/profile', updateProfile);
AuthRouter.get('/google', googleAuth);
AuthRouter.get('/google/callback', googleAuthCallback);
AuthRouter.get('/facebook', facebookAuth);
AuthRouter.get('/facebook/callback', facebookAuthCallback);

export default AuthRouter;
