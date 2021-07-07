import React, { useState } from "react";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";

import { postSignup } from "../../utils/api";
import { Eye, EyeHide } from "../../assets/icons";
import { FloatingCard } from "../shared";

const SignUpComponent = () => {
  const validationSchema = Yup.object({
    username: Yup.string()
      .trim()
      .min(5, "Username should be minimum 5 characters")
      .matches(
        /^(?=[a-z_.\d]*[a-z])[a-zA-Z_.\d]{5,}$/,
        "Can contain only alphanumeric characters and '_' and '.' special characters. There must be at least one alphabet"
      )
      .required("This is a required field"),
    email: Yup.string()
      .trim()
      .email("Email must be a valid email")
      .required("This is a required field"),
    password: Yup.string()
      .trim()
      .min(8, "Password should have at least 8 characters")
      .required("This is a required field"),
    confirmPassword: Yup.string().when("password", {
      is: (val) => (val && val.length > 0 ? true : false),
      then: Yup.string().oneOf(
        [Yup.ref("password")],
        "Both password need to be the same"
      ),
    }),
  });

  type FormData = Partial<Yup.InferType<typeof validationSchema>>;

  const initialValues: FormData = {};

  const submitHandler = async (values: FormData) => {
    try {
      setLoading(true);
      delete values.confirmPassword;
      const res = await postSignup(values);
      if (res) {
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      // Fire and forget
    }
  };

  const [passwordShown, setPasswordShown] = useState(false);
  const [confPasswordShown, setConfPasswordShown] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);

  const togglePasswordVisibility = () => {
    setPasswordShown(passwordShown ? false : true);
  };
  const toggleConfPasswordVisibility = () => {
    setConfPasswordShown(confPasswordShown ? false : true);
  }

  return (
    <div className="flex flex-col">
      <FloatingCard
        title="Get Started"
        verticalHeader="SIGN UP"
        bottomText="Already have an account?"
        bottomTextLink="Sign In"
        linkHref="/login"
      >
        <>
          <Formik
            initialValues={initialValues}
            onSubmit={submitHandler}
            validateOnBlur={false}
            validationSchema={validationSchema}
            enableReinitialize
          >
            {({ errors, touched }) => (
              <Form>
                <h1 className="text-lightgray font-bold">Email</h1>
                <Field
                  name="email"
                  type="email"
                  className="mb-4 border-b-2 border-lightgraycustom text-lightgraycustom font-semibold outline-none focus:outline-none w-full px-2 py-1"
                />
                {touched.email && errors.email && (
                  <div className="text-red-500 text-sm -mt-4 mb-3">
                    {errors.email}
                  </div>
                )}
                <h1 className="text-lightgray font-bold">Username</h1>
                <Field
                  name="username"
                  type="text"
                  className="mb-4 border-b-2 border-lightgraycustom text-lightgraycustom font-semibold outline-none focus:outline-none w-full px-2 py-1"
                />
                {touched.username && errors.username && (
                  <div className="text-red-500 text-sm -mt-4 mb-3">
                    {errors.username}
                  </div>
                )}
                <div className="relative">
                  <h1 className="text-lightgray font-bold">Password</h1>
                  <Field
                    name="password"
                    type={passwordShown ? "text" : "password"}
                    className="mb-4 border-b-2 border-lightgraycustom text-lightgraycustom font-semibold outline-none focus:outline-none w-full px-2 py-1"
                  />
                  <i
                    className="absolute top-8 right-3 cursor-pointer"
                    onClick={togglePasswordVisibility}
                  >
                    {passwordShown ? <EyeHide /> : <Eye />}
                  </i>
                </div>
                {touched.password && errors.password && (
                  <div className="text-red-500 text-sm -mt-4 mb-3">
                    {errors.password}
                  </div>
                )}
                <div className="relative">
                  <h1 className="text-lightgray font-bold">Confirm Password</h1>
                  <Field
                    name="confirmPassword"
                    type={confPasswordShown ? "text" : "password"}
                    className="mb-4 border-b-2 border-lightgraycustom text-lightgraycustom font-semibold outline-none focus:outline-none w-full px-2 py-1"
                  />
                  <i
                    className="absolute top-8 right-3 cursor-pointer"
                    onClick={toggleConfPasswordVisibility}
                  >
                    {confPasswordShown ? <EyeHide /> : <Eye />}
                  </i>
                </div>
                {touched.confirmPassword && errors.confirmPassword && (
                  <div className="text-red-500 text-sm -mt-4 mb-3">
                    {errors.confirmPassword}
                  </div>
                )}
                <div className="flex items-center justify-center relative">
                  <button
                    type="submit"
                    disabled={Object.keys(errors).length > 0 || loading}
                    className={`bg-white border-2 outline-none focus:outline-none hover:opacity-80 w-2/3 text-md font-bold py-2 px-4 my-2 rounded ${
                      Object.keys(errors).length > 0 || loading
                        ? "border-lightgray text-lightgray"
                        : "border-primaryGreen-200 text-primaryGreen-200"
                    }`}
                  >
                    {loading ? "Please wait..." : "SIGN UP"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </>
      </FloatingCard>
    </div>
  );
};

export default SignUpComponent;
