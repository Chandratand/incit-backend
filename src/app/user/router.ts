import express from 'express';
import { getAllusers, getUserStats, veriyEmail } from './controller';

const UserRouter = express();
UserRouter.get('', getAllusers);
UserRouter.get('/stats', getUserStats);
UserRouter.post('/verify-email', veriyEmail);

export default UserRouter;
