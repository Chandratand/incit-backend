import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import AuthService from './service';
import authenticateUser from '../../middlewares/auth';
import { AuthUser } from '../../types';

export const signUp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AuthService.SignUp(req);
    res.status(StatusCodes.OK).json({
      message: 'Sign Up Success, Verify Your Email!',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const signIn = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AuthService.SignIn(req);
    res.status(StatusCodes.OK).json({
      message: 'SignIn Success!',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authUser = authenticateUser(req, res, next) as AuthUser;
    const result = await AuthService.resetPassword(req, authUser);
    res.status(StatusCodes.OK).json({
      message: 'Password reset successfully!',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authUser = authenticateUser(req, res, next) as AuthUser;
    const result = await AuthService.updateProfile(req, authUser);
    res.status(StatusCodes.OK).json({
      message: 'Successfully update profile!',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
