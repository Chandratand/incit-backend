import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import AuthService from './service';

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

export const signOut = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AuthService.signOut(req);
    res.status(StatusCodes.OK).json({
      message: 'Sign out Success!',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AuthService.resetPassword(req);
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
    const result = await AuthService.updateProfile(req);
    res.status(StatusCodes.OK).json({
      message: 'Successfully update profile!',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const checkVerificationStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AuthService.checkVerifiedEmail(req);
    res.status(StatusCodes.OK).json({
      message: result ? 'Email is verified' : 'Email is not verified',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const resendEmailVerification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AuthService.resendEmailVerification(req);
    res.status(StatusCodes.OK).json({
      message: 'Resend Email Success',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const googleVerifyToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AuthService.googleVefrifyId(req);
    res.status(StatusCodes.OK).json({
      message: 'SignIn Success!',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const facebookVerifyToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AuthService.facebookVefrifyId(req);
    res.status(StatusCodes.OK).json({
      message: 'SignIn Success!',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
