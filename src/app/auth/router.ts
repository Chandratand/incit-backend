import express from 'express';
import { googleAuth, googleAuthCallback, resetPassword, signIn, signUp, updateProfile } from './controller';

const AuthRouter = express();
AuthRouter.post('/sign-up', signUp);
AuthRouter.post('/sign-in', signIn);
AuthRouter.post('/reset-password', resetPassword);
AuthRouter.put('/profile', updateProfile);
AuthRouter.get('/google', googleAuth);
AuthRouter.get('/google/callback', googleAuthCallback);

export default AuthRouter;
