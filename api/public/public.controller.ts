import { MongoClient } from "mongodb";
import { getDbClient } from "../services/mongodb.service";
import { NextApiRequest, NextApiResponse } from "next";
import { NextHandler } from "next-connect";
import { linkDBSchema } from "../links/link.schema";
import { errors } from "../error/error.constant";
import * as MongoDB from "mongodb";
import { userDBSchema } from "../auth/auth.schema";

export const getLinkPublic = async (
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextHandler
) => {
  try {
    let username = req.query.user as string;
    const dbClient: MongoClient = await getDbClient();
    let findUser = await dbClient
      .db()
      .collection("users")
      .findOne<userDBSchema>({ username }, {});
    if (!findUser) {
      throw errors.USER_NOT_AVAILABLE;
    }
    const updateViews = await dbClient
      .db()
      .collection("links")
      .updateMany(
        { userId: findUser._id, status: true },
        { $inc: { views: 1 } }
      );
    if (updateViews.result.n == 0) {
      throw errors.MONGODB_QUERY_ERROR;
    }
    let result = await dbClient
      .db()
      .collection("links")
      .find<linkDBSchema>(
        { userId: new MongoDB.ObjectId(findUser._id), status: true },
        {}
      )
      .toArray();

    if (!result) {
      throw errors.NOT_FOUND;
    }
    res.json({ success: true, result, username: findUser.username });
  } catch (err) {
    next(err);
  }
};
