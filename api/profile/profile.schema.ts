import * as yup from "yup";

export const userProfileSchema = yup.object({
  username: yup
    .string()
    .trim()
    .matches(/^(?=[A-Za-z_.\d]*[A-Za-z])[a-zA-Z_.\d]{5,}$/, "Invalid username"),
  name: yup.string().trim(),
  bio: yup.string().trim(),
});

export const changePasswordSchema = yup.object({
  oldPassword: yup.string().trim().required(),
  newPassword: yup
    .string()
    .trim()
    .min(8, "Password must have at least 8 characters")
    .required(),
});

export type UserProfile = yup.InferType<typeof userProfileSchema>;
export type ChangePassword = yup.InferType<typeof changePasswordSchema>;
