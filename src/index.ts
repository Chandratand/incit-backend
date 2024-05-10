import cors from 'cors';
import * as dotenv from 'dotenv';
import express from 'express';
import AuthRouter from './app/auth/router';
import UserRouter from './app/user/router';
import errorHandler from './middlewares/errorHandler';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        name: string;
        isVerified?: boolean;
      };
    }
  }
}

dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'welcome to INCIT api',
  });
});

app.use(`/users`, UserRouter);
app.use(`/auth`, AuthRouter);

app.use((req, res) => {
  res.status(404).send({ message: 'Route does not exist' });
});
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running in PORT: ${PORT}`);
});
