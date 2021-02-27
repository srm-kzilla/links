import * as yup from "yup";
import * as mongoDB from "mongodb";

export const userLoginSchema = yup.object({
  username: yup.string().trim(),
  email: yup.string().trim().email().required(),
  password: yup
    .string()
    .trim()
    .min(8, "password should have at least 8 characters"),
});

export const userSignupSchema = yup.object({
  username: yup
  .string()
  .trim()
  .min(5, "username must have at least 5 characters")
  .matches(/^(?=[a-z_.\d]*[a-z])[a-zA-Z_.\d]{5,}$/, "Username can contain only aphanumeric characters and '_' and '.' special characters. There must be at least one alphabet"),
  email: yup.string().trim().email().required(),
  password: yup
    .string()
    .trim()
    .min(8, "password must have at least 8 characters"),
  createdAt: yup.number().default(() => {
    return +new Date();
  }),
  updatedAt: yup.number().default(() => {
    return +new Date();
  }),
});

export type userLogin = yup.InferType<typeof userLoginSchema>;
export type userSignup = yup.InferType<typeof userSignupSchema>;
export interface userDBSchema extends userSignup {
  _id?: mongoDB.ObjectID;
}
