import { MongoClient } from "mongodb";
import { getDbClient } from "../services/mongodb.service";
import { NextApiRequest, NextApiResponse } from "next";
import { NextHandler } from "next-connect";
import {
  linkDBSchema,
  LinkUpdate,
  linkSchema,
  linkAddSchema,
} from "./link.schema";
import { userDBSchema } from "../auth/auth.schema";
import * as MongoDB from "mongodb";
import { errors } from "../error/error.constant";
import { jwtPayload } from "../auth/auth.schema";
import getFavicons from "get-website-favicon";
import { LINK_DEFAULT_IMAGE_URL } from "../constants/data.constants";

export const addLink = async (
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextHandler
) => {
  try {
    const user: jwtPayload = JSON.parse(req.env.user) as jwtPayload;
    const dbClient: MongoClient = await getDbClient();
    const userDB = await dbClient.db().collection("users");
    const findUser = await userDB.findOne<userDBSchema>({
      email: user.email,
    });

    if (!findUser) {
      throw errors.USER_NOT_FOUND;
    }
    var favicon = await getFavicons(req.body.url);
    let faviconUrl;
    if (favicon.icons.length > 0) {
      faviconUrl = favicon.icons[0].src;
    }

    const link: linkAddSchema = {
      title: req.body.title,
      url: req.body.url,
      status: req.body.status,
      userId: findUser._id,
      image: faviconUrl || LINK_DEFAULT_IMAGE_URL,
    };
    const validatedData = await linkSchema.cast(link);
    const response = await dbClient
      .db()
      .collection("links")
      .insertOne(validatedData);
    if (response.result.n === 0) throw errors.MONGODB_QUERY_ERROR;
    res.json({
      success: true,
      _id: response.insertedId,
      image: validatedData.image,
    });
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
    let { title, url, status } = req.body as LinkUpdate;
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
    let faviconUrl;
    if (url) {
      const favicon = await getFavicons(url);
      if (favicon.icons.length > 0) {
        faviconUrl = favicon.icons[0].src;
      } else {
        faviconUrl = LINK_DEFAULT_IMAGE_URL;
      }
    }

    const updateLink = await dbClient
      .db()
      .collection("links")
      .updateOne(
        { userId: findUser._id, _id: new MongoDB.ObjectID(linkId) },

        { $set: { title, url, status, image: faviconUrl } }
      );
    if (updateLink.result.n === 0) {
      throw errors.MONGODB_CONNECT_ERROR;
    }
    res.json({ success: true, message: "Link has been updated successfully." });
  } catch (err) {
    next(err);
  }
};
