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
import { UserDB } from "../auth/auth.schema";
import * as MongoDB from "mongodb";
import { errors } from "../error/error.constant";
import { JwtPayload } from "../auth/auth.schema";
import {
  LINK_DEFAULT_IMAGE_URL,
  FETCH_FAVICON,
  KZILLAXYZ_POST,
  YOUTUBE_FAVICON,
  GET_KZILLAXYZ_ANALYTICS,
} from "../constants/data.constants";
import axios from "axios";

export const addLink = async (
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextHandler
) => {
  try {
    const user: JwtPayload = JSON.parse(req.env.user) as JwtPayload;
    const dbClient: MongoClient = await getDbClient();
    const userDB = await dbClient.db().collection("users");
    const findUser = await userDB.findOne<UserDB>({
      email: user.email,
    });
    if (!findUser) {
      throw errors.USER_NOT_FOUND;
    }
    let faviconUrl;
    let kzillaXYZdata;
    try {
      const URL = req.body.url;
      const data = { longUrl: URL };
      let kzillaXYZ = await axios.post(KZILLAXYZ_POST, data, {
        headers: {
          "Content-Type": "application/json",
          authorization: process.env.KZILLAXYZWEEBHOOKTOKEN || "",
        },
      });
      kzillaXYZdata = kzillaXYZ.data;
      if (URL.includes("youtube")) {
        faviconUrl = YOUTUBE_FAVICON;
      } else {
        const fetchFavicon = await axios.get(FETCH_FAVICON + URL);

        const favIcons = fetchFavicon.data.icons.filter(
          (url) => url.height >= 32 && url.height <= 100
        );
        faviconUrl = favIcons[0].url;
      }
    } catch (err) {
      faviconUrl = LINK_DEFAULT_IMAGE_URL;
    }
    const link: linkAddSchema = {
      title: req.body.title,
      url: req.body.url,
      status: req.body.status,
      userId: findUser._id,
      image: faviconUrl,
      shortCode: kzillaXYZdata.shortCode,
      analyticsCode: kzillaXYZdata.analyticsCode,
    };
    const validatedData = await linkSchema.cast(link);
    const response = await dbClient
      .db()
      .collection("links")
      .insertOne(validatedData);
    if (response.result.n === 0) throw errors.MONGODB_QUERY_ERROR;
    res.json({
      success: true,
      message: "🎉 Link added successfully!",
      _id: response.insertedId,
      image: validatedData.image,
      shortCode: kzillaXYZdata.shortCode,
      analyticsCode: kzillaXYZdata.analyticsCode,
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
    const user: JwtPayload = JSON.parse(req.env.user) as JwtPayload;
    const dbClient: MongoClient = await getDbClient();
    const findUser = await dbClient
      .db()
      .collection("users")
      .findOne<UserDB>({ email: user.email });
    if (!findUser) {
      throw errors.USER_NOT_FOUND;
    }
    const views = await dbClient
      .db()
      .collection("links")
      .aggregate([
        { $match: { userId: findUser._id } },
        { $group: { _id: null, viewCount: { $sum: "$views" } } },
      ])
      .toArray();
    const viewCount = views[0]?.viewCount ? views[0].viewCount : 0;

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
    res.json({ success: true, result, viewCount });
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
    const user: JwtPayload = JSON.parse(req.env.user) as JwtPayload;
    const dbClient: MongoClient = await getDbClient();

    const findUser = await dbClient
      .db()
      .collection("users")
      .findOne<UserDB>({ email: user.email });
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
      throw errors.MONGODB_QUERY_ERROR;
    }
    res.json({
      success: true,
      message: "🗑️ Link deleted successfully!",
    });
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
    const user: JwtPayload = JSON.parse(req.env.user) as JwtPayload;
    const linkId = req.query.linkId as string;
    const dbClient: MongoClient = await getDbClient();
    const findUser = await dbClient
      .db()
      .collection("users")
      .findOne<UserDB>({ email: user.email });

    if (!findUser) {
      throw errors.USER_NOT_FOUND;
    }
    let faviconUrl;
    let kzillaXYZdata;
    if (url) {
      try {
        let data = { longUrl: url };
        let kzillaXYZ = await axios.post(KZILLAXYZ_POST, data, {
          headers: {
            "Content-Type": "application/json",
            authorization: process.env.KZILLAXYZWEEBHOOKTOKEN || "",
          },
        });
        kzillaXYZdata = kzillaXYZ.data;
        const fetchFavicon = await axios.get(FETCH_FAVICON + url);

        const favIcons = fetchFavicon.data.icons.filter(
          (url) => url.height >= 32 && url.height <= 100
        );
        faviconUrl = favIcons[0].url;
      } catch (err) {
        faviconUrl = LINK_DEFAULT_IMAGE_URL;
      }
    }

    const updateLink = await dbClient
      .db()
      .collection("links")
      .updateOne(
        { userId: findUser._id, _id: new MongoDB.ObjectID(linkId) },

        {
          $set: {
            title,
            url,
            status,
            image: faviconUrl,
            shortCode: kzillaXYZdata?.shortCode,
            analyticsCode: kzillaXYZdata?.analyticsCode,
          },
        }
      );
    if (updateLink.result.n === 0) {
      throw errors.MONGODB_QUERY_ERROR;
    }
    res.json({
      success: true,
      message: "✅ Link updated successfully!",
    });
  } catch (err) {
    next(err);
  }
};

export const getLinkStats = async (
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextHandler
) => {
  try {
    let kzillaXYZ;
    const user: JwtPayload = JSON.parse(req.env.user) as JwtPayload;
    const linkId = req.query.linkId as string;
    const dbClient: MongoClient = await getDbClient();
    const findUser = await dbClient
      .db()
      .collection("users")
      .findOne<UserDB>({ email: user.email });

    if (!findUser) {
      throw errors.USER_NOT_FOUND;
    }
    const findLink = await dbClient
      .db()
      .collection("links")
      .findOne<linkDBSchema>(
        {
          _id: new MongoDB.ObjectID(linkId),
        },
        {}
      );

    if (!findLink) {
      throw errors.LINK_NOT_FOUND;
    }
    try {
      kzillaXYZ = await axios.get(
        GET_KZILLAXYZ_ANALYTICS + findLink.analyticsCode,
        {
          headers: {
            authorization: process.env.KZILLAXYZWEEBHOOKTOKEN || "",
          },
        }
      );
    } catch (err) {
      throw errors.SOMETHING_WENT_WRONG;
    }

    const kzillaXYZdata = kzillaXYZ.data;
    let conversionRate = Math.floor(
      (kzillaXYZdata.clicks / findLink.views) * 100
    ).toString();
    if (conversionRate == "Infinity" || conversionRate == "NaN") {
      conversionRate = "NIL";
    }

    let maxValue =
      kzillaXYZdata.reports.length > 0
        ? kzillaXYZdata.reports[1].data.reduce(function (prev, current) {
            return prev.value > current.value ? prev : current;
          })
        : "NIL";

    maxValue.label == "(not set)"
      ? (maxValue.label = "Unknown City")
      : maxValue.label;

    const result = { maxValue, conversionRate };
    res.json({ success: true, result });
  } catch (err) {
    next(err);
  }
};
