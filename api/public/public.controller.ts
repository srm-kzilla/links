import { MongoClient } from "mongodb";
import { getDbClient } from "../services/mongodb.service";
import { NextApiRequest, NextApiResponse } from "next";
import { NextHandler } from "next-connect";
import { linkDBSchema } from "../links/link.schema";
import { errors } from "../error/error.constant";
import { ObjectID } from "mongodb";

export const getLinkPublic = async (
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextHandler
) => {
  try {
    let userId = req.query.userId as string;
    const dbClient: MongoClient = await getDbClient();
    let result = await dbClient
      .db("links")
      .collection("links")
      .find<linkDBSchema>({ userId: new ObjectID(userId), enabled: true })
      .toArray();
    if (!result) {
      throw errors.NOT_FOUND;
    }
    res.json({ success: true, result });
  } catch (err) {
    next(err);
  }
};
