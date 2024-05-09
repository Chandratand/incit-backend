import express from 'express';
import { signIn, signUp } from './controller';

const AuthRouter = express();
AuthRouter.post('/sign-up', signUp);
AuthRouter.post('/sign-in', signIn);

export default AuthRouter;
