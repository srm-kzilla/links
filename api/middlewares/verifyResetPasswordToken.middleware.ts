import next, { NextApiRequest, NextApiResponse } from "next";
import nc, { NextHandler } from "next-connect";
import { verify } from "jsonwebtoken";
import { JwtPayload, UserDB } from "../auth/auth.schema";
import { errors } from "../error/error.constant";
import { MongoClient } from "mongodb";
import { getDbClient } from "../services/mongodb.service";

export const validateToken = async (
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextHandler
) => {
  try {
    const token = req.headers["reset-password"] as string;
    if (!token) {
      throw errors.JWT_ERROR;
    }
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw errors.MISSING_ENV_VARIABLES;
    }
    const payload: JwtPayload = verify(token, jwtSecret, {
      issuer: "srmkzilla",
    }) as JwtPayload;
    const dbClient: MongoClient = await getDbClient();
    if (
      await dbClient
        .db()
        .collection("users")
        .findOne<UserDB>({ email: payload.email })
    ) {
      req.env = {
        user: JSON.stringify(payload),
      };
      next();
    } else {
      throw errors.USER_NOT_FOUND;
    }
  } catch (err) {
    next({
      httpStatus: err.httpStatus || 500,
      message: err.message,
    });
  }
};
