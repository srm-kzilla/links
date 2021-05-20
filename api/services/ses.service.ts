import aws from "aws-sdk";
import { errors } from "../error/error.constant";
let sesClient: aws.SESV2;
export async function initSesClient(): Promise<aws.SESV2> {
  sesClient = new aws.SESV2();
  if (!sesClient) {
    throw errors.AWS_CONNECT_ERROR;
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
