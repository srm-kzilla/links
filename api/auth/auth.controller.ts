import { MongoClient } from "mongodb";
import { getDbClient } from "../services/mongodb.service";
import { NextApiRequest, NextApiResponse } from "next";
import { NextHandler } from "next-connect";
import jwt, { verify } from "jsonwebtoken";
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
import { verifyAccountTemplate } from "../../verifyaccount.template";
import { baseUrl } from "../../utils/constants";

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
    if (await dbClient.db().collection("tempusers").findOne<UserDB>({ body })) {
      throw errors.UNVERIFIED_ACCOUNT;
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
    next({
      httpStatus: err.httpStatus || 500,
      message: err.message,
    });
  }
};

export const getVerifyAccount = async (
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextHandler
) => {
  try {
    let secret = req.query.secret as string;
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw errors.MISSING_ENV_VARIABLES;
    }
    console.log(secret);
    const payload: JwtPayload = verify(secret, jwtSecret, {
      issuer: "srmkzilla",
    }) as JwtPayload;

    const dbClient: MongoClient = await getDbClient();
    let user = await dbClient
      .db()
      .collection("tempusers")
      .findOne<UserDB>({ email: payload.email });

    if (!user) {
      throw errors.USER_NOT_FOUND;
    }
    const data = await dbClient
      .db()
      .collection("users")
      .insertOne(userSignupSchema.cast(user));
    if (!data) {
      throw errors.MONGODB_QUERY_ERROR;
    }

    //TO DO: edit profile check duplicate username in tempusers

    const token = jwt.sign(
      { email: user.email, _id: data.ops[0]._id },
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
  } catch (err) {
    next({
      httpStatus: err.httpStatus || 500,
      message: err.message,
    });
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
    if (result) {
      throw errors.DUPLICATE_USER;
    }
    let tempUser = await dbClient
      .db()
      .collection("tempusers")
      .findOne<UserDB>({ email: email });
    if (tempUser) {
      throw errors.UNVERIFIED_ACCOUNT;
    }
    let usernameExists = await dbClient
      .db()
      .collection("users")
      .findOne<UserDB>({ username: username });
    if (usernameExists) {
      throw errors.DUPLICATE_USERNAME;
    }
    let tempUsernameExists = await dbClient
      .db()
      .collection("users")
      .findOne<UserDB>({ username: username });
    if (tempUsernameExists) {
      throw errors.DUPLICATE_USERNAME;
    }
    const saltRounds = 12;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    let user = {
      email,
      password: hash,
      username,
      createdAt: new Date(),
    };
    await dbClient
      .db()
      .collection("tempusers")
      .createIndex({ createdAt: 1 }, { expireAfterSeconds: 86400 });
    const data = await dbClient.db().collection("tempusers").insertOne(user);

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw errors.MISSING_ENV_VARIABLES;
    }
    if (!data) {
      throw errors.MONGODB_QUERY_ERROR;
    }

    const secret = jwt.sign({ email }, jwtSecret, {
      expiresIn: "1d",
      issuer: "srmkzilla",
    });
    aws.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });

    const ses = new aws.SESV2();
    if (!ses) {
      throw errors.AWS_CONNECT_ERROR;
    }

    const params = {
      Content: {
        Simple: {
          Body: {
            Html: {
              Charset: "UTF-8",
              Data: verifyAccountTemplate({
                username: user.username,
                baseUrl: baseUrl,
                secret: secret,
              }),
            },
          },
          Subject: {
            Charset: "UTF-8",
            Data: "Verify Your Account",
          },
        },
      },
      Destination: {
        ToAddresses: [email],
      },
      FromEmailAddress: "LINKS by SRMKZILLA" + process.env.SES_SOURCE,
    };
    const emailSent = await ses.sendEmail(params).promise();
    if (!emailSent) {
      throw errors.AWS_CONNECT_ERROR;
    }
    res.status(200).json({
      success: true,
      token: secret,
      message:
        "🎊 Account created successfully!. Please verify your Email to proceed",
    });
  } catch (err) {
    next({
      httpStatus: err.httpStatus || 500,
      message: err.message,
    });
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
      throw errors.EMAIL_NOT_FOUND;
    }
    const OTP = Math.floor(Math.random() * 1000000);

    dbClient
      .db()
      .collection("otp")
      .createIndex({ createdAt: 1 }, { expireAfterSeconds: 300 });
    await dbClient.db().collection("otp").insertOne({
      email: email,
      otp: OTP,
      createdAt: new Date(),
    });
    aws.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });

    const ses = new aws.SESV2();
    if (!ses) {
      throw errors.AWS_CONNECT_ERROR;
    }

    const params = {
      Content: {
        Simple: {
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
      },
      Destination: {
        ToAddresses: [email],
      },
      FromEmailAddress: "LINKS by SRMKZILLA" + process.env.SES_SOURCE,
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
      message: err.message,
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

    const dbClient: MongoClient = await getDbClient();
    const databaseOTP = await dbClient
      .db()
      .collection("otp")
      .findOne<resetPasswordOtpDB>({ otp: userRequest.otp });
    if (!databaseOTP) {
      throw errors.INVALID_OTP; //if otp by user doesn't match any otp in database
    }
    if (databaseOTP.email === resetPasswordRequest.email) {
      await dbClient.db().collection("otp").deleteOne({ _id: databaseOTP._id });
      return res.status(200).json({
        success: true,
        message: "🔑 OTP verified successfully!",
      });
    }
    throw errors.INVALID_OTP; //when a user enters an otp that another user got
  } catch (err) {
    next({
      httpStatus: err.httpStatus || 500,
      message: err.message,
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
      message: "🔒️ Password updated successfully!",
    });
  } catch (err) {
    next({
      httpStatus: err.httpStatus || 500,
      message: err.message,
    });
  }
};
