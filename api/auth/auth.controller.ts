import { MongoClient } from "mongodb";
import { getDbClient } from "../services/mongodb.service";
import { NextApiRequest, NextApiResponse } from "next";
import { NextHandler } from "next-connect";
import multer from "multer";
import jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import {
  UserLogin,
  UserSignup,
  JwtPayload,
  UserOTPRequest,
  UserInfo,
  ChangePassword,
} from "./auth.schema";
import { errors } from "../error/error.constant";
interface MulterRequest extends NextApiRequest {
  files: any;
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
      .db()
      .collection("users")
      .findOne<UserLogin>(body, { projection: { _id: 0 } });
    if (!result) {
      throw errors.USER_NOT_FOUND;
    }

    if (await bcrypt.compare(password, result.password)) {
      const token = jwt.sign(
        {
          email: result.email,
          username: result.username,
          name: result.name,
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
      throw errors.WRONG_PASSWORD;
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
    let { username, email, password } = req.body as UserSignup;
    const dbClient: MongoClient = await getDbClient();
    let result = await dbClient
      .db()
      .collection("users")
      .findOne({ email: email });
    const saltRounds = 12;
    if (result) {
      throw errors.DUPLICATE_USER;
    }
    let usernameExists = await dbClient
      .db()
      .collection("users")
      .findOne({ username: username });
    if (usernameExists) {
      throw errors.DUPLICATE_USERNAME;
    }
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    await dbClient.db().collection("users").insertOne({
      email,
      password: hash,
      name: "",
      bio: "",
      username,
    });

    const token = jwt.sign(
      { username, email, name: "" },
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

export const getUser = async (
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextHandler
) => {
  try {
    let payload = req.env.user;
    let user: JwtPayload = JSON.parse(payload);
    if (!user) {
      throw errors.USER_NOT_FOUND;
    } else {
      delete user.iat;
      return res.status(200).json({
        success: true,
        data: user,
      });
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
    let user: JwtPayload = JSON.parse(payload);
    if (!user) {
      throw errors.USER_NOT_FOUND;
    }
    const dbClient: MongoClient = await getDbClient();

    const OTP = Math.floor(Math.random() * 1000000);
    const createdAt = new Date().getTime();
    //TO DO: encode OTP?
    await dbClient
      .db()
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
  } catch (err) {
    next(err);
  }
};

export const verifyOTP = async (
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextHandler
) => {
  try {
    let payload = req.env.user;
    let user: JwtPayload = JSON.parse(payload);
    if (!user) {
      throw errors.USER_NOT_FOUND;
    }

    const userRequest = req.body as UserOTPRequest;
    if (!userRequest) {
      throw errors.INVALID_OTP;
    }

    const dbClient: MongoClient = await getDbClient();
    const databaseOTP = await dbClient
      .db()
      .collection("otp")
      .findOne({ otp: userRequest.otp });
    if (!databaseOTP) {
      throw errors.INVALID_OTP; //if otp by user doesn't match any otp in database
    }

    if (databaseOTP.email === user.email) {
      if (databaseOTP.expiresAt < new Date().getTime()) {
        throw errors.OTP_EXPIRED;
      }
      //TO DO: Delete OTP document when otp has expired

      await dbClient.db().collection("otp").deleteOne({ _id: databaseOTP._id });
      return res.status(200).json({
        success: true,
      });
    } else {
      throw errors.INVALID_OTP; //when a user enters an otp that another user got
      //(when email in token doesn't match the email in database but the otp in request and the database matches)
    }
  } catch (err) {
    next(err);
  }
};

export const patchProfile = async (
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextHandler
) => {
  try {
    let payload = req.env.user;
    let user: JwtPayload = JSON.parse(payload);
    if (!user) {
      throw errors.USER_NOT_FOUND;
    }
    let data = req.body as UserInfo;
    let profilePicture = [];

    if ((req as MulterRequest).files.length > 0) {
      profilePicture = (req as MulterRequest).files.map((file) => {
        return { img: file.filename };
      });
    }

    const dbClient: MongoClient = await getDbClient();
    //TO DO: if data same as before, don't update
    if (data.username) {
      let usernameExists = await dbClient
        .db()
        .collection("users")
        .findOne({ username: data.username });
      if (usernameExists) {
        throw errors.DUPLICATE_USERNAME;
      }
    }
    // await dbClient
    //   .db()
    //   .collection("users")
    //   .updateOne({ email: user.email }, { $set: data });
    return res.status(200).json({
      success: true,
      data: data,
      profilePicture: profilePicture,
    });
  } catch (err) {
    next(err);
  }
};

export const patchPassword = async (
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextHandler
) => {
  try {
    let payload = req.env.user;
    let user = JSON.parse(payload) as JwtPayload;
    if (!user) {
      throw errors.USER_NOT_FOUND;
    }
    let { oldPassword, newPassword } = req.body as ChangePassword;

    const dbClient: MongoClient = await getDbClient();
    let userInfo = await dbClient
      .db()
      .collection("users")
      .findOne<UserLogin>({ email: user.email }, {});
    if (oldPassword !== userInfo.password) {
      throw errors.WRONG_PASSWORD;
    }
    //TO DO in frontend: check that the new password is not same as old password
    await dbClient
      .db()
      .collection("users")
      .updateOne({ email: user.email }, { $set: { password: newPassword } });
    return res.status(200).json({
      success: true,
    });
  } catch (err) {
    next(err);
  }
};
