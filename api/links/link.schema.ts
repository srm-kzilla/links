import * as yup from "yup";
import * as mongoDB from "mongodb";

export const linkSchema = yup.object({
  name: yup.string().required(),
  url: yup.string().url().required(),
  email: yup.string().email(),
  enabled: yup.boolean().default(true),
  views: yup.number().default(0),
  clicks: yup.number().default(0),
  createdAt: yup.number().default(() => {
    return +new Date();
  }),
  updatedAt: yup.number().default(() => {
    return +new Date();
  }),
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
  name: yup.string(),
  url: yup.string().url(),
  email: yup.string(),
});

export interface linkDBSchema extends Link {
  _id?: mongoDB.ObjectID;
  userId?: mongoDB.ObjectID;
}
export type linkUpdate = yup.InferType<typeof linkUpdateSchema>;
export type Link = yup.InferType<typeof linkSchema>;
