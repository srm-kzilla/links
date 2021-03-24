import { MongoClient } from "mongodb";
import { getDbClient } from "../services/mongodb.service";
import { NextApiRequest, NextApiResponse } from "next";
import { NextHandler } from "next-connect";
import jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import { userLogin, userSignup, jwtPayload } from "./auth.schema";
import { errors } from "../error/error.constant";

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
      throw errors.USER_NOT_FOUND;
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
      throw errors.UNAUTHORIZED;
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
    let payload = req.env.user;
    let user: jwtPayload = JSON.parse(payload);
    if (!user) {
      throw errors.USER_NOT_FOUND;
    } else {
      const dbClient: MongoClient = await getDbClient();
      if (
        await dbClient
          .db("links")
          .collection("user")
          .findOne({ email: user.email })
      ) {
        delete user.iat;
        return res.status(200).json({
          success: true,
          data: user,
        });
      } else {
        throw errors.USER_NOT_FOUND;
      }
    }
  } catch (err) {
    next(err);
  }
};

export const getOTP = async (
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextHandler
) => {
  try {
    let payload = req.env.user;
    let user: jwtPayload = JSON.parse(payload);
    if (!user) {
      throw errors.USER_NOT_FOUND;
    }
    const dbClient: MongoClient = await getDbClient();
    if (
      await dbClient
        .db("links")
        .collection("user")
        .findOne({ email: user.email })
    ) {
      const OTP = Math.floor(Math.random() * 1000000);
      const createdAt = new Date().getTime();
      await dbClient
        .db("links")
        .collection("otp")
        .insertOne({
          email: user.email,
          otp: OTP,
          createdAt: createdAt,
          expiresAt: createdAt + 10 * 60000,
        });
      return res.status(200).json({
        success: true,
        otp: OTP,
        createdAt: createdAt,
        expiresAt: createdAt + 10 * 60000,
      });
    }
    throw errors.USER_NOT_FOUND;
  } catch (err) {
    next(err);
  }
};
