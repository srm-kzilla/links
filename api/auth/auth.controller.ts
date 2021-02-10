import { MongoClient } from "mongodb";
import { getDbClient } from "../services/mongodb.service";
import { NextApiRequest, NextApiResponse } from "next";
import { NextHandler } from "next-connect";
import jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import { User } from "../../models/user-schema";

export const postLogin = async (
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextHandler
) => {
  try {
    console.log(req.body);
    const user: User = req.body;
    const dbClient: MongoClient = await getDbClient();
    let result = await dbClient
      .db("links")
      .collection("user")
      .findOne({ email: user.email });

    if (!result) {
      res.status(404).json("User not found");
    }

    //TODO: check password with the hashed value

    delete result["password"];

    const token = await jwt.sign({ result }, process.env.JWT_SECRET || "");
    res.json({ token });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Internal Server Error",
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
    console.log(req.body);
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
      console.log(hash);
      console.log(user);
      await dbClient.db("links").collection("user").insertOne(user);
    }

    delete user["password"];
    console.log(user);
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
