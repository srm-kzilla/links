import * as yup from "yup";

export const validationSchema = yup.object({
    title: yup.string().trim().required("This is a required field"),
    url: yup.string()
        .trim()
        .url()
        .required("This is a required field"),
});