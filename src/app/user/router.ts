import express from 'express';
import { getAllusers, getUserStats } from './controller';
import authenticateUser from '../../middlewares/auth';

const UserRouter = express();
UserRouter.get('', getAllusers);
UserRouter.get('/stats', getUserStats);

export default UserRouter;
