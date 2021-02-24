import * as yup from "yup";

export const userSchema = yup.object({
  name: yup.string().trim(),
  email: yup.string().email().trim().required(),
  password: yup
    .string()
    .trim()
    .min(8, "password should have at least 8 characters"),
  createdAt: yup.number().default(() => {
    return +new Date();
  }),
  updatedAt: yup.number().default(() => {
    return +new Date();
  }),
});

export type User = yup.InferType<typeof userSchema>;
