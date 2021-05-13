import { MongoClient } from "mongodb";
import { getDbClient } from "../services/mongodb.service";
import { NextApiRequest, NextApiResponse } from "next";
import { NextHandler } from "next-connect";
import jwt, { verify } from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import {
  UserSignup,
  JwtPayload,
  UserOTPRequest,
  UserDB,
  UserLogin,
  userSignupSchema,
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
      message: `${err.name}: ${err.message}`,
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
    //TO DO: Delete document from tempuser after successful verification,
    //to not let user verify again
    //TO DO: setCookie from backend, authToken or send as headers
    //TO DO: If user verified, directly redirect on button click in mail
    //TO DO: Send handled errors to frontend
    //TO DO: edit profile check duplicate username in tempusers
    //TO DO: login check signed up user in tempusers, request to verify

    // const token = jwt.sign(
    //   { email: user.email, _id: data.ops[0]._id },
    //   jwtSecret,
    //   {
    //     expiresIn: "1d",
    //     issuer: "srmkzilla",
    //   }
    // );
    res.redirect(`${baseUrl}login`);
  } catch (err) {
    next({
      httpStatus: err.httpStatus || 500,
      message: `${err.name}: ${err.message}`,
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
      throw errors.DUPLICATE_USER;
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
    });
  } catch (err) {
    next({
      httpStatus: err.httpStatus || 500,
      message: `${err.name}: ${err.message}`,
    });
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
