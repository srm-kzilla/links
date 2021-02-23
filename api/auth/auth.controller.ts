import { MongoClient } from "mongodb";
import { getDbClient } from "../services/mongodb.service";
import { NextApiRequest, NextApiResponse } from "next";
import { NextHandler } from "next-connect";
import jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import { User } from "../../models/user-schema";
import {userDBSchema} from "./auth.schemas"

export const postLogin = async (
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextHandler
) => {
  try {
    let user: User = req.body;
    const dbClient: MongoClient = await getDbClient();
    let result = await dbClient
      .db("links")
      .collection("user")
      .findOne<userDBSchema>({ email: user.email }, {projection: {_id: 0}});

    if (!result) {
      return res.status(401).json({ msg: "User not found" });
    }

    const isAuthorised = await bcrypt.compare(
      user.password,
      result["password"]
    );

    if (isAuthorised) {
      const token = jwt.sign({email: result.email} , process.env.JWT_SECRET || "", {
        expiresIn: "1d",
        issuer: "srmkzilla"
      });
      return res.status(200).json({ token, msg: "User authorised" });
    } else {
      return res.status(401).json({ msg: "Invalid password!" });
    }
  } catch (err) {
    res.status(500).send({
      msg: "Internal Server Error",
      err: err,
    });
  }
};

export const postSignup = async (
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextHandler
) => {
  try {
    let user: User = req.body;
    const dbClient: MongoClient = await getDbClient();
    let result = await dbClient
      .db("links")
      .collection("user")
      .findOne({ email: user.email });
    const saltRounds = 12;
    if (result) {
      return res.status(409).json({
        msg: "User already exists",
      });
    } else {
      const salt = await bcrypt.genSalt(saltRounds);
      const hash = await bcrypt.hash(user.password, salt);
      user.password = hash;
      await dbClient.db("links").collection("user").insertOne(user);
    }

    delete user["password"];
    const token = await jwt.sign(user, process.env.JWT_SECRET || "");
    res.json({ token });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Internal Server Error",
      err: err,
    });
  }
};
