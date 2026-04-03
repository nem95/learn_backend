import { NextFunction, Request, Response } from "express";
import z, { ZodType } from "zod";

export const validateSchema = (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
  const result = schema.safeParse(req.body);
  
  if (!result.success) {
    return res.status(400).json({
      errors: result.error.issues.map((err: z.core.$ZodIssue) => ({
        path: err.path,
        message: err.message
      }))
    });
  }
  
  req.body = result.data;
  next();
};
