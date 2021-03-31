import { MongoClient } from "mongodb";
import { getDbClient } from "../services/mongodb.service";
import { NextApiRequest, NextApiResponse } from "next";
import { NextHandler } from "next-connect";
import { linkDBSchema, linkUpdate, linkSchema } from "./link.schema";
import { userDBSchema } from "../auth/auth.schema";
import * as MongoDB from "mongodb";
import { errors } from "../error/error.constant";
import { jwtPayload } from "../auth/auth.schema";
import getFavicons from "get-website-favicon";

export const addLink = async (
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextHandler
) => {
  try {
    const validateData = await linkSchema.cast(req.body);
    const user: jwtPayload = JSON.parse(req.env.user) as jwtPayload;
    const dbClient: MongoClient = await getDbClient();
    const userDB = await dbClient.db().collection("users");
    const findUser = await userDB.findOne<userDBSchema>({
      email: user.email,
    });

    if (!findUser) {
      throw errors.USER_NOT_FOUND;
    }
    const Favicon = await getFavicons(validateData.url);
    const FaviconUrl = Favicon.icons[0].src;
    const link: linkDBSchema = {
      ...validateData,
      userId: findUser._id,
      image: FaviconUrl,
    };
    const response = await dbClient.db().collection("links").insertOne(link);
    if (response.result.n === 0) throw errors.MONGODB_QUERY_ERROR;
    res.json({ success: true, _id: response.insertedId, image: FaviconUrl });
  } catch (err) {
    next(err);
  }
};

export const getLink = async (
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextHandler
) => {
  try {
    const user: jwtPayload = JSON.parse(req.env.user) as jwtPayload;
    const dbClient: MongoClient = await getDbClient();
    const findUser = await dbClient
      .db()
      .collection("users")
      .findOne<userDBSchema>({ email: user.email });
    if (!findUser) {
      throw errors.USER_NOT_FOUND;
    }
    const result = await dbClient
      .db()
      .collection("links")
      .find<linkDBSchema>(
        {
          userId: findUser._id,
        },
        {}
      )
      .toArray();

    if (!result) {
      throw errors.NOT_FOUND;
    }
    res.json({ success: true, result });
  } catch (err) {
    next(err);
  }
};

export const deleteLink = async (
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextHandler
) => {
  try {
    const linkId = req.query.linkId as string;
    const user: jwtPayload = JSON.parse(req.env.user) as jwtPayload;
    const dbClient: MongoClient = await getDbClient();

    const findUser = await dbClient
      .db()
      .collection("users")
      .findOne<userDBSchema>({ email: user.email });
    if (!findUser) {
      throw errors.USER_NOT_FOUND;
    }

    const deleteLink = await dbClient
      .db()
      .collection("links")
      .findOneAndDelete({
        userId: findUser._id,
        _id: new MongoDB.ObjectID(linkId),
      });
    if (deleteLink.value === null) {
      throw errors.MONGODB_CONNECT_ERROR;
    }
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

export const updateLink = async (
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextHandler
) => {
  try {
    let { title, url, status, image } = req.body as linkUpdate;
    const user: jwtPayload = JSON.parse(req.env.user) as jwtPayload;
    const linkId = req.query.linkId as string;
    const dbClient: MongoClient = await getDbClient();
    const findUser = await dbClient
      .db()
      .collection("users")
      .findOne<userDBSchema>({ email: user.email });

    if (!findUser) {
      throw errors.USER_NOT_FOUND;
    }
    const updateLink = await dbClient
      .db()
      .collection("links")
      .updateOne(
        { userId: findUser._id, _id: new MongoDB.ObjectID(linkId) },

        { $set: { title, url, status, image } }
      );
    if (updateLink.result.n === 0) {
      throw errors.MONGODB_CONNECT_ERROR;
    }
    res.json({ success: true, message: "Link has been updated successfully." });
  } catch (err) {
    next(err);
  }
};
