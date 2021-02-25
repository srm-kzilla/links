import * as yup from "yup";

export const userLoginSchema = yup.object({
  username: yup.string().trim(),
  email: yup.string().trim().email().required(),
  password: yup
    .string()
    .trim()
    .min(8, "password should have at least 8 characters"),
});

export const userSignupSchema = yup.object({
  username: yup.string().trim().min(5, "username must have at least 5 characters"),
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
