import express from 'express';
import { resetPassword, signIn, signUp, updateProfile } from './controller';
import authenticateUser from '../../middlewares/auth';

const AuthRouter = express();
AuthRouter.post('/sign-up', signUp);
AuthRouter.post('/sign-in', signIn);
AuthRouter.post('/reset-password', resetPassword);
AuthRouter.put('/profile', updateProfile);

export default AuthRouter;
