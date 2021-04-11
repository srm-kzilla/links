import * as yup from "yup";

export const validationSchema = yup.object({
    title: yup.string().trim().required("This is a required field"),
    url: yup.string()
        .trim()
        // .matches(
        //     /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
        //     "Enter correct url!"
        // )
        .url()
        .required("This is a required field"),
});