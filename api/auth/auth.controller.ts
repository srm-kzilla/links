import { MongoClient } from "mongodb";
import { getDbClient } from "../services/mongodb.service";
import { NextApiRequest, NextApiResponse } from "next";
import { NextHandler } from "next-connect";
import jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import aws from "aws-sdk";
import { resetPasswordTemplate } from "../../resetpassword.template";

import {
  UserSignup,
  JwtPayload,
  UserOTPRequest,
  UserDB,
  UserLogin,
  userSignupSchema,
  UserEmail,
  resetPasswordOtpDB,
  ResetPassword,
} from "./auth.schema";
import { errors } from "../error/error.constant";

export const postLogin = async (
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextHandler
) => {
  try {
    let { password } = req.body;
    const dbClient: MongoClient = await getDbClient();

    let body = req.body as UserLogin;
    delete body["password"];

    let result = await dbClient.db().collection("users").findOne<UserDB>(body);
    if (!result) {
      throw errors.USER_NOT_FOUND;
    }

    if (await bcrypt.compare(password, result.password)) {
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        throw errors.MISSING_ENV_VARIABLES;
      }

      const token = jwt.sign(
        { email: result.email, _id: result._id },
        jwtSecret,
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
      .findOne<UserDB>({ email: email });
    const saltRounds = 12;
    if (result) {
      throw errors.DUPLICATE_USER;
    }
    let usernameExists = await dbClient
      .db()
      .collection("users")
      .findOne<UserDB>({ username: username });
    if (usernameExists) {
      throw errors.DUPLICATE_USERNAME;
    }
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);

    let user = {
      email,
      password: hash,
      username,
    };
    const validatedUser = userSignupSchema.cast(user);

    const data = await dbClient
      .db()
      .collection("users")
      .insertOne(validatedUser);

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw errors.MISSING_ENV_VARIABLES;
    }
    if (!data) {
      throw errors.MONGODB_QUERY_ERROR;
    }
    const token = jwt.sign({ email, _id: data.ops[0]._id }, jwtSecret, {
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

export const getOTP = async (
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextHandler
) => {
  try {
    let { email } = req.body as UserEmail;

    const dbClient: MongoClient = await getDbClient();
    const user = await dbClient
      .db()
      .collection("users")
      .findOne<UserDB>({ email: email });
    if (!user) {
      throw errors.USER_NOT_FOUND;
    }
    const OTP = Math.floor(Math.random() * 1000000);
    const createdAt = new Date().getTime();
    //DOUBT: encode OTP before storing in db?
    await dbClient
      .db()
      .collection("otp")
      .insertOne({
        email: email,
        otp: OTP,
        createdAt,
        expiresAt: createdAt + 5 * 60000,
      });
    aws.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });

    const ses = new aws.SES({ apiVersion: "2010-12-01" });
    if (!ses) {
      throw errors.AWS_CONNECT_ERROR;
    }

    const params = {
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: resetPasswordTemplate({
              name: user.name || user.username,
              otp: OTP,
            }),
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: "Reset your password",
        },
      },
      Source: "LINKS by SRMKZILLA" + process.env.SES_SOURCE,
    };
    const emailSent = await ses.sendEmail(params).promise();
    if (!emailSent) {
      throw errors.AWS_CONNECT_ERROR;
    }
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw errors.MISSING_ENV_VARIABLES;
    }
    const resetPasswordToken = jwt.sign({ email }, jwtSecret, {
      expiresIn: "15m",
      issuer: "srmkzilla",
    });

    return res.status(200).json({
      success: true,
      resetPasswordToken: resetPasswordToken,
    });
  } catch (err) {
    next({
      httpStatus: err.httpStatus || 500,
      message: `${err.name}: ${err.message}`,
    });
  }
};

export const verifyOTP = async (
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextHandler
) => {
  try {
    let payload = req.env.user;
    let resetPasswordRequest: JwtPayload = JSON.parse(payload);
    if (!resetPasswordRequest) {
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
      .findOne<resetPasswordOtpDB>({ otp: userRequest.otp });
    if (!databaseOTP) {
      throw errors.INVALID_OTP; //if otp by user doesn't match any otp in database
    }

    if (databaseOTP.email === resetPasswordRequest.email) {
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
    next({
      httpStatus: err.httpStatus || 403,
      message: `${err.name}: ${err.message}`,
    });
  }
};

export const resetPassword = async (
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
    let { newPassword } = req.body as ResetPassword;

    const dbClient: MongoClient = await getDbClient();

    const saltRounds = 12;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(newPassword, salt);

    await dbClient
      .db()
      .collection("users")
      .updateOne({ email: user.email }, { $set: { password: hash } });
    return res.status(200).json({
      success: true,
    });
  } catch (err) {
    next({
      httpStatus: err.httpStatus || 403,
      message: `${err.name}: ${err.message}`,
    });
  }
};
