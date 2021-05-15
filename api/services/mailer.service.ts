import aws from "aws-sdk";
import next from "next";
import { errors } from "../error/error.constant";
export async function sendMail(
  toAddresses: string[],
  subject: string,
  data: string
) {
  try {
    aws.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });

    const ses = new aws.SESV2();
    if (!ses) {
      throw errors.AWS_CONNECT_ERROR;
    }

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
    const emailSent = await ses.sendEmail(params).promise();
    if (!emailSent) {
      throw errors.AWS_CONNECT_ERROR;
    }
  } catch (err) {
    next(err);
  }
}
