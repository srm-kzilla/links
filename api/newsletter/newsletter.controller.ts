import { MongoClient } from "mongodb";
import { getDbClient } from "../services/mongodb.service";
import { NextApiRequest, NextApiResponse } from "next";
import { NextHandler } from "next-connect";
import { errors } from "../error/error.constant";

import {
  SubscribeType,
  subscribeDBSchema,
  subscribeSchema,
} from "./newsletter.schema";
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
      .findOne<subscribeDBSchema>({ email, subscribe: true });
    if (findSubscriber) {
      return res.json({
        success: true,
        message: "You are already subscribed ",
      });
    }
    const validatedData = await subscribeSchema.cast({ email });
    const addSubscriber = await dbClient
      .db()
      .collection("subscribers")
      .updateOne({ email }, { $set: validatedData }, { upsert: true });
    if (addSubscriber.result.n !== 1) {
      throw errors.MONGODB_QUERY_ERROR;
    }
    return res.json({
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
      .updateOne({ email }, { $set: { subscribe: false } });
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
