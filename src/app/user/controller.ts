import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import UserService from './service';

export const getAllusers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await UserService.get();
    res.status(StatusCodes.OK).json({
      message: 'Retrieve user successfully!',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await UserService.stats();
    res.status(StatusCodes.OK).json({
      message: 'Retrieve user stats successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const veriyEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await UserService.verifyEmail(req);
    res.status(StatusCodes.OK).json({
      message: 'Email verification success.',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
