import { MongoClient } from "mongodb";
import { getDbClient } from "../services/mongodb.service";
import { NextApiRequest, NextApiResponse } from "next";
import { NextHandler } from "next-connect";
import { linkDBSchema } from "../links/link.schema";
import { errors } from "../error/error.constant";
import * as MongoDB from "mongodb";
import { UserDB } from "../auth/auth.schema";
import { SubscribeType, subscribeDBSchema } from "./public.schema";

export const getLinkPublic = async (
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextHandler
) => {
  try {
    let username = req.query.user as string;
    const dbClient: MongoClient = await getDbClient();
    let user = await dbClient
      .db()
      .collection("users")
      .findOne<UserDB>({ username }, {});
    if (!user) {
      throw errors.USER_NOT_AVAILABLE;
    }
    const updateViews = await dbClient
      .db()
      .collection("links")
      .updateMany({ userId: user._id, status: true }, { $inc: { views: 1 } });
    if (updateViews.result.n == 0) {
      throw errors.MONGODB_QUERY_ERROR;
    }
    let result = await dbClient
      .db()
      .collection("links")
      .find<linkDBSchema>(
        { userId: new MongoDB.ObjectId(user._id), status: true },
        {}
      )
      .toArray();

    if (!result) {
      throw errors.NOT_FOUND;
    }
    delete user["_id"];
    delete user["password"];
    delete user["createdAt"];
    delete user["updatedAt"];
    delete user["email"];
    res.json({
      success: true,
      result,
      ...user,
    });
  } catch (err) {
    next(err);
  }
};

export const subscribe = async (
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextHandler
) => {
  try {
    const { email } = req.body as SubscribeType;
    const dbClient: MongoClient = await getDbClient();

    const findSubscriber = await dbClient
      .db()
      .collection("subscribers")
      .findOne<subscribeDBSchema>({ email });
    if (findSubscriber) {
      throw errors.SUBSCRIBER_EXIST;
    }
    const response = await dbClient
      .db()
      .collection("subscribers")
      .insertOne({ email });
    if (response.result.n == 0) {
      throw errors.MONGODB_QUERY_ERROR;
    }
    res.json({
      success: true,
      message: "🎉 Wohoo! You have been subscribed to the mailing list !",
    });
  } catch (err) {
    next(err);
  }
};

export const unsubscribe = async (
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextHandler
) => {
  try {
    const { email } = req.body as SubscribeType;
    const dbClient: MongoClient = await getDbClient();

    const findSubscriber = await dbClient
      .db()
      .collection("subscribers")
      .findOne<subscribeDBSchema>({ email });
    if (!findSubscriber) {
      throw errors.SUBSCRIBER_NOT_FOUND;
    }
    const removeSubscriber = await dbClient
      .db()
      .collection("subscribers")
      .deleteOne({ email });
    if (removeSubscriber.result.n !== 1) {
      throw errors.MONGODB_QUERY_ERROR;
    }
    res.json({
      success: true,
      message: "😢 You have been successfully unsubscribed",
    });
  } catch (err) {
    next(err);
  }
};
