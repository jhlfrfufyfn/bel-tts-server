import express from 'express';
import { validationResult, ValidationChain } from 'express-validator';
// can be reused by many routes

// parallel processing
export const validateParallel = (validations: ValidationChain[]) => {
  return async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    await Promise.all(validations.map(validation => validation.run(request)));

    const errors = validationResult(request);
    if (errors.isEmpty()) {
      return next();
    }

    response.status(400).json({ errors: errors.array() });
  };
};

// sequential processing, stops running validations chain if the previous one have failed.
export const validateSequantial = (validations: ValidationChain[]) => {
  return async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    for (const validation of validations) {
      const result = await validation.run(request);
      if (result.array().length > 0) break;
    }

    const errors = validationResult(request);
    if (errors.isEmpty()) {
      return next();
    }

    response.status(400).json({ errors: errors.array() });
  };
};