import { MongoClient } from "mongodb";
import { errors } from "../error/error.constant";

let dbClient: MongoClient;
export async function initDbClient(): Promise<MongoClient> {
  const mongodbURI = process.env.MONGODB_URI;
  if (!mongodbURI) {
    throw errors.MISSING_ENV_VARIABLES;
  }
  dbClient = await MongoClient.connect(mongodbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    ignoreUndefined: true,
  });
  console.log("✔️  Connected to Database");
  return dbClient;
}

export async function getDbClient(): Promise<MongoClient> {
  if (!dbClient) {
    await initDbClient();
  }
  return dbClient;
}