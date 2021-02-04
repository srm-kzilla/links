// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { MongoClient } from 'mongodb';
import { getDbClient } from "../../util/mongodb";
import { NextApiRequest, NextApiResponse } from "next"

export default async function (req: NextApiRequest, res: NextApiResponse) {
    var link = req.body.link;
    var email = req.body.email;
    const dbClient: MongoClient = await getDbClient();
    // Get the documents collection
    const collection = dbClient.db('links').collection('link');
    // Insert a document
    collection.insertOne({ link: link, email: email });
    console.log("Inserted 1 documents into the collection");
    res.statusCode = 200;
}
