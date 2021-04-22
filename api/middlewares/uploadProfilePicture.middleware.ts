import multer from "multer";
import multerS3 from "multer-s3";
import aws from "aws-sdk";
import { NextApiResponse, NextApiRequest } from "next";
import { NextHandler } from "next-connect";
import { getDbClient } from "../services/mongodb.service";
import { MongoClient } from "mongodb";
import { UserLogin, JwtPayload } from "../auth/auth.schema";
import { errors } from "../error/error.constant";

const s3 = new aws.S3({
  accessKeyId: process.env.S3_ACCESS_KEY_ID || "",
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "",
});

export const uploadProfilePicture = multer({
  storage: multerS3({
    s3: s3,
    bucket: "srmkzilla-test",
    acl: "public-read",
    metadata: function (req, file, cb) {
      cb(null, { fieldName: "profilePicture" });
    },
    key: function (req, file, cb) {
      cb(null, file.originalname);
      console.log("Hi from middleware");
    },
  }),
});

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, path.join(path.dirname(__dirname), "uploads"));
//     },
//     filename: function (req, file, cb) {
//         (null, file.originalname);
//     },
//   });
// export const upload = multer({storage})
