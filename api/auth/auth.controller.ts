import { MongoClient } from "mongodb";
import { getDbClient } from "../services/mongodb.service";
import { NextApiRequest, NextApiResponse } from "next";
import { NextHandler } from "next-connect";
import jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import { userLogin, userSignup } from "./auth.schema";
import { errors } from "../error/error.constant";

export const postLogin = async (
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextHandler
) => {
  try {
    let { username, email, password } = req.body as userLogin;
    const dbClient: MongoClient = await getDbClient();
    console.log(username, password);
    let result = await dbClient
      .db("links")
      .collection("user")
      .findOne<userLogin>(
        { $or: [ { username: username }, { email: email }] },
        { projection: { _id: 0 } }
      );
    console.log(result);
    if (!result) {
      throw errors.USER_NOT_FOUND;
    }

    const isAuthorised = await bcrypt.compare(password, result.password);
    console.log(isAuthorised);
    if (isAuthorised) {
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
