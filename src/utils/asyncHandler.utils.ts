import { Request, Response, NextFunction } from "express";

const asyncHandler = (
  func: (req: Request, res: Response, next: NextFunction) => Promise<void>
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    func(req, res, next).catch((error) => {
      res.status(error.statusCode ? error.statusCode : 500).json({
        error: error.name,
        message: error.message,
        errors: error.errors,
      });
    });
  };
};

const functionsAsyncHandler = (func: (...arg: any[]) => Promise<any>) => {
  return (...arg: any[]): any => {
    func(...arg).catch((error) => {
      return error;
    });
  };
};

export { asyncHandler };
