import * as yup from "yup";
import { ObjectID } from "mongodb";
//TO DO: add min length for bio
export const userLoginSchema = yup
  .object({
    username: yup
      .string()
      .trim()
      .matches(
        /^(?=[A-Za-z_.\d]*[A-Za-z])[a-zA-Z_.\d]{5,}$/,
        "Invalid username"
      ),
    email: yup.string().trim().email(),
    password: yup.string().trim().required(),
    name: yup.string().trim(),
    bio: yup.string().trim(),
    profilePicture: yup.string().trim().url(),
  })
  .test("xor", "object should have either username or email", (val) => {
    return !!val.username !== !!val.email;
  });

export const userSignupSchema = yup.object({
  username: yup
    .string()
    .trim()
    .min(5, "username must have at least 5 characters")
    .matches(
      /^(?=[A-Za-z_.\d]*[A-Za-z])[a-zA-Z_.\d]{5,}$/,
      "Username can contain only aphanumeric characters and '_' and '.' special characters. There must be at least one alphabet"
    )
    .required(),
  email: yup.string().trim().email().required(),
  password: yup
    .string()
    .trim()
    .min(8, "Password must have at least 8 characters")
    .required(),
  name: yup.string().trim().default(""),
  bio: yup.string().trim().default(""),
  profilePicture: yup
    .string()
    .trim()
    .url()
    .default(
      "https://bestbody.com.au/wp-content/uploads/2019/11/placeholder-person.png"
    ),
  background: yup.string().trim().default("white"),
  createdAt: yup.number().default(() => {
    return +new Date();
  }),
  updatedAt: yup.number().default(() => {
    return +new Date();
  }),
});

export const jwtRequestSchema = yup
  .object({
    authorization: yup
      .string()
      .trim()
      .min(1, "JWT cannot be null")
      .matches(/^Bearer .+$/, "JWT should be Bearer Token"),
  })
  .required();

export const userOTPRequestSchema = yup.object({
  otp: yup
    .number()
    .test(
      "len",
      "Must be exactly 6 characters",
      (val) => val && val.toString().length === 6
    ),
});

export interface JwtPayload {
  email: string;
  _id: ObjectID;
  iat: number;
  exp: number;
  iss: "srmkzilla";
}
export type JwtRequest = yup.InferType<typeof jwtRequestSchema>;
export type UserSignup = yup.InferType<typeof userSignupSchema>;
export type UserLogin = yup.InferType<typeof userLoginSchema>;

export interface UserDB extends UserSignup {
  _id?: ObjectID;
}
export type UserOTPRequest = yup.InferType<typeof userOTPRequestSchema>;
