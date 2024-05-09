const { Prisma } = require('@prisma/client');
const { StatusCodes } = require('http-status-codes');
import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.log('Error:', err);
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong, please try again later',
    error: err.errors,
  };

  // Prisma validation errors
  if (err instanceof Prisma.PrismaClientValidationError) {
    customError.msg = 'Invalid data provided';
    customError.statusCode = 400;
  }

  // Handling unique constraint violation
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      customError.msg = `Duplicate value entered for ${err.meta.target} field, please choose another value`;
      customError.statusCode = 400;
    }
  }

  // Handling not found error
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2025') {
      customError.msg = `No item found with the provided identifier.`;
      customError.statusCode = 404;
    }
  }

  if (err instanceof ZodError) {
    customError.msg = 'Validation Error';
    customError.statusCode = 400;
  }

  return res.status(customError.statusCode).json({ message: customError.msg, error: customError.error });
};

export default errorHandler;
