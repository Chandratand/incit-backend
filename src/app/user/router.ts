import express from 'express';
import { getAllusers, getUserStats } from './controller';
import authenticateUser from '../../middlewares/auth';

const UserRouter = express();
UserRouter.get('', authenticateUser, getAllusers);
UserRouter.get('/stats', authenticateUser, getUserStats);

export default UserRouter;
