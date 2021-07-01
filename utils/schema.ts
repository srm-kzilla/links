import * as yup from "yup";

export const addLinkValidationSchema = yup.object({
    title: yup.string().trim().required("This is a required field"),
    url: yup.string()
        .trim()
        .url()
        .required("This is a required field"),
});

export const passwordValidationSchema = yup.object({
    oldPassword: yup.string().trim().required("This is a required field"),
    newPassword: yup
        .string()
        .trim()
        .min(8, "Password must have at least 8 characters")
        .required("This is a required field"),
    confirmNewPassword: yup.string().oneOf(
        [yup.ref("newPassword"), null],
        "Passwords must match")
        .required("This is a required field"),
});

export const forgotPasswordValidationSchema = yup.object({
    newPassword: yup
        .string()
        .trim()
        .min(8, "Password must have at least 8 characters")
        .required("This is a required field"),
    confirmNewPassword: yup.string().oneOf(
        [yup.ref("newPassword"), null],
        "Passwords must match")
        .required("This is a required field"),
});

export const forgotPasswordEmailValidationSchema = yup.object({
    email: yup
    .string()
    .trim()
    .email()
    .required("This is a required field"),
});