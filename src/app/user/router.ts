import express from 'express';
import { getAllusers, getUserStats, veriyEmail } from './controller';
import { authenticateUser } from '../../middlewares/auth';

const UserRouter = express();
UserRouter.get('', authenticateUser, getAllusers);
UserRouter.get('/stats', authenticateUser, getUserStats);
UserRouter.post('/verify-email', veriyEmail);

export default UserRouter;
