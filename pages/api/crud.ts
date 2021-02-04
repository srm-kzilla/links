// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { MongoClient } from 'mongodb';
import { getDbClient } from "../../util/mongodb";
import { NextApiRequest, NextApiResponse } from "next"

// export default async function (req: NextApiRequest, res: NextApiResponse) {
//   var email = req.body.email;
//   const dbClient: MongoClient = await getDbClient();
//   // Get the documents collection
//   const collection = dbClient.db('links').collection('link');
//   // Find some documents
//   const data = await collection.find({ email: ("sanskritikhare142@gmail.com") }).project({ _id: false, email: false }).toArray();
//   res.statusCode = 200;
//   res.json(data);
// }

export default async function (req: NextApiRequest, res: NextApiResponse) {
  var email = req.body.email;
  var link = req.body.link;
  var newLink = req.body.newLink;

  const dbClient: MongoClient = await getDbClient();
  const collection = dbClient.db('links').collection('link'); // Get the documents collection

  if (req.method === 'DELETE') {
    // Delete document where email is {email} and link is {link}
    await collection.deleteOne({ email: email, link: link })
    console.log("Removed the document with the email id equal to " + email);
    res.statusCode = 200;
  }

  else if (req.method === 'POST') {
    // Insert a document
    await collection.insertOne({ link: link, email: email });
    console.log("Inserted 1 document into the collection");
    res.statusCode = 200;
  }
  else if (req.method === 'PATCH') {
    await collection.updateOne({ email: email, link: link }, { $set: { link: newLink } })
    console.log("Updated the document with email id " + email + " and link " + link + " with " + newLink);
  }

  else {
    const data = await collection.find({ email: email }).project({ _id: false, email: false }).toArray();
    res.statusCode = 200;
    res.json(data);
  }
}