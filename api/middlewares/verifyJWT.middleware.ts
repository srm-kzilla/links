import next, { NextApiRequest, NextApiResponse } from "next";
import nc, { NextHandler } from "next-connect";
import { verify } from "jsonwebtoken";
import { JwtRequest, JwtPayload } from "../auth/auth.schema";
import { errors } from "../error/error.constant";
import { MongoClient } from "mongodb";
import { getDbClient } from "../services/mongodb.service";

export const validateUser = async (
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
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw errors.MISSING_ENV_VARIABLES;
    }
    const payload: JwtPayload = verify(authToken, jwtSecret, {
      issuer: "srmkzilla",
    }) as JwtPayload;
    const dbClient: MongoClient = await getDbClient();
    if (
      await dbClient.db().collection("users").findOne({ email: payload.email })
    ) {
      req.env = {
        user: JSON.stringify(payload),
      };
      next();
    } else {
      next(errors.USER_NOT_FOUND);
    }
  } catch (err) {
    next({
      httpStatus: 403,
      message: `${err.name}: ${err.message}`,
    });
  }
};
