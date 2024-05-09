import express from 'express';
import { getAllusers, getUserStats } from './controller';

const UserRouter = express();
UserRouter.get('', getAllusers);
UserRouter.get('/stats', getUserStats);

export default UserRouter;
