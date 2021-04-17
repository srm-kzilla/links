import * as yup from "yup";
import * as mongoDB from "mongodb";
import { LINK_DEFAULT_IMAGE_URL } from "../constants/data.constants";

export const linkSchema = yup.object({
  title: yup.string().required(),
  url: yup.string().url().required(),
  image: yup.string().default(LINK_DEFAULT_IMAGE_URL),
  status: yup.boolean().default(true),
  views: yup.number().default(0),
  shortCode: yup.string(),
  analyticsCode: yup.string(),
  createdAt: yup.number().default(() => {
    return +new Date();
  }),
});
export const linkAddSchema = yup.object({
  title: yup.string().required(),
  url: yup.string().url().required(),
  status: yup.boolean().default(true),
  image: yup.string(),
  shortCode: yup.string(),
  analyticsCode: yup.string(),
});
export const linkDeleteSchema = yup
  .object({
    linkId: yup
      .string()
      .trim()
      .min(1, "linkId cannot be null")
      .test("linkId", "linkId is invalid", (value) => {
        return mongoDB.ObjectID.isValid(value!);
      }),
  })
  .required();

export const linkUpdateSchema = yup.object({
  title: yup.string(),
  url: yup.string(),
  status: yup.boolean(),
});

export interface linkDBSchema extends Link {
  _id?: mongoDB.ObjectID;
  userId?: mongoDB.ObjectID;
}
export interface linkAddSchema extends LinkAdd {
  userId: mongoDB.ObjectID;
}

export type LinkAdd = yup.InferType<typeof linkAddSchema>;
export type LinkUpdate = yup.InferType<typeof linkUpdateSchema>;
export type Link = yup.InferType<typeof linkSchema>;
