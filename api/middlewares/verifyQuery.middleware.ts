import * as yup from "yup";
import { NextApiRequest, NextApiResponse } from "next";
import { NextHandler } from "next-connect";
import { errors } from "../error/error.constant";

type RequestLocations = "query" | "body" | "headers";

/**
 * Generic Request Validator
 * @param {RequestLocations} location The parameter of the req object to be validated.
 * @param {yup.ObjectSchema} schema The schema against which validation is to be done.
 */

export const validateQuery = (
  location: RequestLocations,
  schema: yup.ObjectSchema<any, any, any, any>
) => {
  return async (
    req: NextApiRequest,
    res: NextApiResponse,
    next: NextHandler
  ) => {
    let _location: any;
    switch (location) {
      case "query":
        _location = req.query;
        break;
      case "body":
        _location = req.body;
        break;
      case "headers":
        _location = req.headers;
        break;
    }
    try {
      await schema.validate(_location, { abortEarly: false });
      next();
    } catch (error) {
      let message: string = "";
      error.errors.forEach((e: string) => {
        message += `${e}. `;
      });
      next({
        httpStatus: 400,
        message: message,
      });
    }
  };
};
