import { MongoClient } from "mongodb";
import { getDbClient } from "../services/mongodb.service";
import { NextApiRequest, NextApiResponse } from "next";
import { NextHandler } from "next-connect";
import jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import { User } from "../../models/user-schema";
import { userDBSchema } from "./auth.schemas";
import { errors } from "../error/error.constant";

export const postLogin = async (
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextHandler
) => {
  try {
    let user: User = req.body as User;
    const dbClient: MongoClient = await getDbClient();
    let result = await dbClient
      .db("links")
      .collection("user")
      .findOne<User>({ email: user.email }, { projection: { _id: 0 } });

    if (!result) {
      throw errors.USER_NOT_FOUND
    }

    const isAuthorised = await bcrypt.compare(
      user.password,
      result["password"]
    );

    if (isAuthorised) {
      const token = jwt.sign(
        { email: result.email },
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
      throw errors.USER_NOT_FOUND
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
    let user: User = req.body as User;
    const dbClient: MongoClient = await getDbClient();
    let result = await dbClient
      .db("links")
      .collection("user")
      .findOne({ email: user.email });
    const saltRounds = 12;
    if (result) {
      throw errors.DUPLICATE_USER;
    } else {
      const salt = await bcrypt.genSalt(saltRounds);
      const hash = await bcrypt.hash(user.password, salt);
      user.password = hash;
      await dbClient.db("links").collection("user").insertOne(user);
    }

    const token = jwt.sign(
      { email: result.email },
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
  } catch (err) {
    next(err);
  }
};
