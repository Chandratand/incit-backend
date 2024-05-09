import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

const validateData = (schema: z.ZodSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    schema.parse(req.body);
    next();
  };
};

export default validateData;
