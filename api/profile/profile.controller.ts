import { MongoClient } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { NextHandler } from "next-connect";
import { UserProfile, ChangePassword } from "./profile.schema";
import { JwtPayload, UserDB } from "../auth/auth.schema";
import { errors } from "../error/error.constant";
import { getDbClient } from "../services/mongodb.service";
import * as bcrypt from "bcrypt";
import { getS3Client } from "../services/s3.service";

export const getProfile = async (
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
    if (!dbClient) {
      throw errors.MONGODB_CONNECT_ERROR;
    }
    let userInfo = await dbClient
      .db()
      .collection("users")
      .findOne<UserDB>(
        { email: user.email },
        { projection: { _id: 0, password: 0 } }
      );
    return res.status(200).json({
      success: true,
      data: userInfo,
    });
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

    let data = req.body as UserProfile;

    const dbClient: MongoClient = await getDbClient();

    let usernameExists = await dbClient
      .db()
      .collection("users")
      .findOne<UserDB>({ username: data.username });

    if (
      data.name !== usernameExists?.name ||
      data.username !== usernameExists?.username ||
      data.bio !== usernameExists?.bio
    ) {
      if (data.username) {
        if (usernameExists && user._id != usernameExists._id) {
          throw errors.DUPLICATE_USERNAME;
        }

        let tempUsernameExists = await dbClient
          .db()
          .collection("tempusers")
          .findOne<UserDB>({ username: data.username });
        if (tempUsernameExists) {
          throw errors.DUPLICATE_USERNAME;
        }
      }
      const updatedAt = new Date().getTime();
      await dbClient
        .db()
        .collection("users")
        .updateOne(
          { email: user.email },
          { $set: { ...data, updatedAt: updatedAt } }
        );

      return res.status(200).json({
        success: true,
        data: data,
        message: "✅  Profile updated successfully!",
      });
    }
    throw errors.NO_NEW_CHANGE;
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
    const s3Client = await getS3Client();
    const postInfo = s3Client.createPresignedPost({
      Bucket: process.env.S3_BUCKET_NAME,
      Fields: {
        key: user._id,
        acl: "public-read",
      },
      Expires: 60, // seconds
      Conditions: [
        ["content-length-range", 0, 1048576], // up to 1 MB
      ],
    });
    if (!postInfo) {
      throw errors.PRESIGNED_URL_ERROR;
    }
    const dbClient: MongoClient = await getDbClient();
    if (!dbClient) {
      throw errors.MONGODB_CONNECT_ERROR;
    }
    const updatedAt = new Date().getTime();
    const objectUrl = process.env.S3_BASE_OBJECT_URL;
    if (!objectUrl) {
      throw errors.MISSING_ENV_VARIABLES;
    }

    await dbClient
      .db()
      .collection("users")
      .updateOne(
        { email: user.email },
        {
          $set: {
            updatedAt: updatedAt,
            profilePicture: objectUrl + user._id,
          },
        }
      );
    res
      .status(200)
      .json({ postInfo, message: "📸 Profile picture added successfully!" });
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
      .findOne<UserDB>({ email: user.email }, {});
    const matchPassword = await bcrypt.compare(oldPassword, userInfo.password);
    if (!matchPassword) {
      throw errors.WRONG_PASSWORD;
    }
    //TO DO in frontend: check that the new password is not same as old password
    const saltRounds = 12;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(newPassword, salt);

    await dbClient
      .db()
      .collection("users")
      .updateOne({ email: user.email }, { $set: { password: hash } });
    return res.status(200).json({
      success: true,
      message: "🔐 Password updated successfully!",
    });
  } catch (err) {
    next(err);
  }
};
