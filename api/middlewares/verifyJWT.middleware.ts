import next, { NextApiRequest, NextApiResponse } from "next";
import nc, { NextHandler } from "next-connect";
import { verify } from "jsonwebtoken";
import {JwtRequest} from "../auth/auth.schema"
import { errors } from "../error/error.constant";

export interface jwtPayload {
  email: string;
}

export const validateUser = (
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextHandler
) => {
  try {
    const { authorization } = req.headers as JwtRequest;
    if (!authorization) {
      return next(errors.JWT_ERROR);
    }
    const authToken = authorization.split(" ")[1];
    const payload: jwtPayload = verify(
      authToken,
      process.env.JWT_SECRET || "",
      { issuer: "srmkzilla" }
    ) as jwtPayload;
    req.env = {
      user: JSON.stringify(payload),
    };
    next();
  } catch (err) {
    next({
      httpStatus: 403,
      message: `${err.name}: ${err.message}`,
    });
  }
};
