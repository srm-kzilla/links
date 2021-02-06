// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { MongoClient } from 'mongodb';
import { getDbClient } from "../../util/mongodb";
import { NextApiRequest, NextApiResponse } from "next"
import jwt from 'jsonwebtoken'

export default async function (req: NextApiRequest, res: NextApiResponse) {
    var link = req.body.link;
    var email = req.body.email;
    const dbClient: MongoClient = await getDbClient();
    if (!req.body){
        res.statusCode = 404
        res.end('Error')
        return
    }

    const { username, password } = req.body;
    
    res.json({
        token: jwt.sign({
            username,
            admin:
        })
        }
    )
    
    // Get the documents collection
    const collection = dbClient.db('links').collection('link');
    // Insert a document
    collection.insertOne({ link: link, email: email });
    console.log("Inserted 1 documents into the collection");
    res.statusCode = 200;
}
