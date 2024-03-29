import aws from "aws-sdk";
import { errors } from "../error/error.constant";
let s3Client: aws.S3;
export async function initS3Client(): Promise<aws.S3> {
  s3Client = new aws.S3({
    accessKeyId: process.env.AWS_CLOUD_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_CLOUD_SECRET_ACCESS_KEY,
    region: process.env.AWS_CLOUD_REGION,
  });
  if (!s3Client) {
    throw errors.AWS_CONNECT_ERROR;
  }
  console.log("✔️  Connected to S3");
  return s3Client;
}

export async function getS3Client(): Promise<aws.S3> {
  if (!s3Client) {
    await initS3Client();
  }
  return s3Client;
}
