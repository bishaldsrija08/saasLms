import { NextFunction, Request, Response } from "express";

const asyncErrorHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err: Error) => {
      return res.status(500).json({
        message: err.message,
        fullError: err
      });
    });
  };
};

export default asyncErrorHandler;