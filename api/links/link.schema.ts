import * as yup from "yup";
import * as mongoDB from "mongodb";

export const linkSchema = yup.object({
  title: yup.string().required(),
  url: yup.string().url().required(),
  image: yup
    .string()
    .default(
      "https://yt3.ggpht.com/ytc/AAUvwnjBxDbxCCpVNyEEKREl0qhQcIJ8DNaJkpv57LDsCMs=s900-c-k-c0x00ffffff-no-rj"
    ),
  status: yup.boolean().default(true),
  views: yup.number().default(0),
  clicks: yup.number().default(0),
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
  image: yup.string(),
});

export interface linkDBSchema extends Link {
  _id?: mongoDB.ObjectID;
  userId?: mongoDB.ObjectID;
}
export type linkUpdate = yup.InferType<typeof linkUpdateSchema>;
export type Link = yup.InferType<typeof linkSchema>;
