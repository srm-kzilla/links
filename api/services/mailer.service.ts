import aws from "aws-sdk";
import { MongoClient } from "mongodb";
import next from "next";
import { errors } from "../error/error.constant";
import { getDbClient } from "./mongodb.service";
import { getSesClient } from "./ses.service";
export async function sendMail(
  toAddresses: string[],
  subject: string,
  data: string
) {
  try {
    const sesClient: aws.SESV2 = await getSesClient();
    const params = {
      Content: {
        Simple: {
          Body: {
            Html: {
              Charset: "UTF-8",
              Data: data,
            },
          },
          Subject: {
            Charset: "UTF-8",
            Data: subject,
          },
        },
      },
      Destination: {
        ToAddresses: toAddresses,
      },
      FromEmailAddress: "LINKS by SRMKZILLA" + process.env.SES_SOURCE,
    };
    const emailSent = await sesClient.sendEmail(params).promise();
    if (!emailSent) {
      throw errors.AWS_CONNECT_ERROR;
    }
    const dbClient: MongoClient = await getDbClient();
    if (!dbClient) {
      throw errors.MONGODB_CONNECT_ERROR;
    }
    const mailDetails = await dbClient
      .db()
      .collection("archives")
      .insertOne({ mailSubject: subject, destination: toAddresses });
    if (!mailDetails) {
      throw errors.MONGODB_QUERY_ERROR;
    }
  } catch (err) {
    next(err);
  }
}
