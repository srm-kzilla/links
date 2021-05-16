import aws from "aws-sdk";
import { errors } from "../error/error.constant";
let sesClient: aws.SESV2;
export async function initSesClient(): Promise<aws.SESV2> {
  aws.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  });
  const sesClient = new aws.SESV2();
  if (!sesClient) {
    throw errors.SES_CONNECT_ERROR;
  }
  console.log("✔️  Connected to SES");
  return sesClient;
}

export async function getSesClient(): Promise<aws.SESV2> {
  if (!sesClient) {
    await initSesClient();
  }
  return sesClient;
}
