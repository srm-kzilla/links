import next, { NextApiRequest, NextApiResponse } from "next";
import nc, { NextHandler } from "next-connect";
import { verify } from "jsonwebtoken";
import * as yup from "yup";
import {errors} from "../error/error.constant"

export const JwtRequestSchema = yup
  .object({
    authorization: yup
      .string()
      .trim()
      .min(1, "JWT cannot be null")
      .matches(/^Bearer .+$/, "JWT should be Bearer Token"),
  })
  .required();

export interface jwtPayload {
  email: string;
}
type JwtRequest = yup.InferType<typeof JwtRequestSchema>;

export const validateUser = (
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextHandler
) => {
    try{
  const {authorization} = req.headers as JwtRequest;
    console.log(authorization);
    if (!authorization) {
      return next(errors.JWT_ERROR);
    }
    const authToken = authorization.split(" ")[1];
    const payload: jwtPayload = verify(
      authToken,
      process.env.JWT_SECRET || "",
      { issuer: "srmkzilla" }
    ) as jwtPayload;
    console.log(payload);
    req.env = {
      user: JSON.stringify(payload)
    }
    next();
  } catch (err) {
    console.log(err);
    next({
        httpStatus: 403,
        message: `${err.name}: ${err.message}`,
      });
  }
};
