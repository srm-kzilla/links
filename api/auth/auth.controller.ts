import { MongoClient } from "mongodb";
import { getDbClient } from "../services/mongodb.service";
import { NextApiRequest, NextApiResponse } from "next";
import { NextHandler } from "next-connect";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import { userLogin, userSignup, JwtRequest } from "./auth.schema";
import { errors } from "../error/error.constant";

export interface jwtPayload {
  email: string;
  username: string;
  iat:number;
  exp: number,
  iss: "srmkzilla"
}

export const postLogin = async (
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextHandler
) => {
  try {
    let { password } = req.body;
    const dbClient: MongoClient = await getDbClient();

    let body = req.body;
    delete body["password"];

    let result = await dbClient
      .db("links")
      .collection("user")
      .findOne<userLogin>(body, { projection: { _id: 0 } });
    if (!result) {
      throw errors.UNAUTHORIZED;
    }

    if (await bcrypt.compare(password, result.password)) {
      const token = jwt.sign(
        {
          email: result.email,
          username: result.username,
        },
        process.env.JWT_SECRET || "",
        {
          expiresIn: "1d",
          issuer: "srmkzilla",
        }
      );
      res.status(200).json({
        success: true,
        authToken: token,
      });
    } else {
      throw errors.USER_NOT_FOUND;
    }
  } catch (err) {
    next(err);
  }
};

export const postSignup = async (
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextHandler
) => {
  try {
    let { username, email, password } = req.body as userSignup;
    const dbClient: MongoClient = await getDbClient();
    let result = await dbClient
      .db("links")
      .collection("user")
      .findOne({ email: email });
    const saltRounds = 12;
    if (result) {
      throw errors.DUPLICATE_USER;
    }
    let usernameExists = await dbClient
      .db("links")
      .collection("user")
      .findOne({ username: username });
    if (usernameExists) {
      throw errors.DUPLICATE_USERNAME;
    }
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    await dbClient
      .db("links")
      .collection("user")
      .insertOne({ username, email, password: hash });

    const token = jwt.sign({ username, email }, process.env.JWT_SECRET || "", {
      expiresIn: "1d",
      issuer: "srmkzilla",
    });
    res.status(200).json({
      success: true,
      authToken: token,
    });
  } catch (err) {
    next(err);
  }
};

export const getUser = async (
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
    let jwtPayload: jwtPayload = jwt.verify(authToken, process.env.JWT_SECRET || "", {
      issuer: "srmkzilla",
    }) as jwtPayload;
    if (!jwtPayload) {
      throw errors.JWT_ERROR;
    } else {
      const dbClient: MongoClient = await getDbClient();
      const user = await dbClient
        .db("links")
        .collection("user")
        .findOne({ email: jwtPayload.email });
      if (!user) {
        throw errors.USER_NOT_FOUND;
      } else {
        delete jwtPayload.iat;
        return res.status(200).json({
          success: true,
          data: jwtPayload,
        });
      }
    }
  } catch (err) {
    if (err instanceof JsonWebTokenError) {
      next(errors.JWT_ERROR);
    }
    next(err);
  }
};