import { MongoClient } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { NextHandler } from "next-connect";
import { UserInfo, ChangePassword } from "./profile.schema";
import { JwtPayload, UserLogin } from "../auth/auth.schema";
import { errors } from "../error/error.constant";
import { getDbClient } from "../services/mongodb.service";
import aws from "aws-sdk";

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
    await dbClient
      .db()
      .collection("users")
      .updateOne({ email: user.email }, { $set: data });
    return res.status(200).json({
      success: true,
      data: data,
    });
  } catch (err) {
    next(err);
  }
};

export const postPicture = async (
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
    const s3 = new aws.S3({
      accessKeyId: process.env.S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      region: process.env.S3_REGION,
    });
    if (!s3) {
      throw errors.AWS_CONNECT_ERROR;
    }
    const postInfo = await s3.createPresignedPost({
      Bucket: process.env.S3_BUCKET_NAME,
      Fields: {
        key: user.username,
        acl: "public-read",
      },
      Expires: 600, // seconds
      Conditions: [
        ["content-length-range", 0, 1048576], // up to 1 MB
      ],
    });
    if (!postInfo) {
      throw errors.PRESIGNED_URL_ERROR;
    }
    res.status(200).json(postInfo);
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
    //TO DO: hash password
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
