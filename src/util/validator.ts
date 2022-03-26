import express from 'express';
import { validationResult, ValidationChain } from 'express-validator';
// can be reused by many routes

// parallel processing
export const validateParallel = (validations: ValidationChain[]) => {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({ errors: errors.array() });
  };
};

// sequential processing, stops running validations chain if the previous one have failed.
export const validateSequantial = (validations: ValidationChain[]) => {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    for (let validation of validations) {
      const result = await validation.run(req);
      if (result.array().length) break;
    }

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({ errors: errors.array() });
  };
};