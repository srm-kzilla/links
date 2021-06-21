import React, { useState } from "react";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";

import { postSignup } from "../../utils/api";
import { Eye, EyeHide } from "../../assets/icons";
import FloatingCard from "../shared/floatingcard";

const SignUpComponent = () => {
  const initialValues = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

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
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("This is a required field"),
  });

  const submitHandler = async (values) => {
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
  const [loading, setLoading] = useState<boolean>(false);
  const togglePasswordVisibility = () => {
    setPasswordShown(passwordShown ? false : true);
  };

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
            onSubmit={(values) => submitHandler(values)}
            validateOnBlur={false}
            validateOnChange={false}
            validationSchema={validationSchema}
          >
            {({ errors }) => (
              <Form>
                <h1 className="text-lightgray font-bold">Email</h1>
                <Field
                  name="email"
                  type="email"
                  className="mb-4 border-b-2 border-lightgraycustom text-lightgraycustom font-semibold outline-none focus:outline-none w-full px-2 py-1"
                />
                {errors.email && (
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
                {errors.username && (
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
                {errors.password && (
                  <div className="text-red-500 text-sm -mt-4 mb-3">
                    {errors.password}
                  </div>
                )}
                <h1 className="text-lightgray font-bold">Confirm Password</h1>
                <Field
                  name="confirmPassword"
                  type="password"
                  className="mb-4 border-b-2 border-lightgraycustom text-lightgraycustom font-semibold outline-none focus:outline-none w-full px-2 py-1"
                />
                {errors.confirmPassword && (
                  <div className="text-red-500 text-sm -mt-4 mb-3">
                    {errors.confirmPassword}
                  </div>
                )}
                <div className="flex items-center justify-center relative">
                  <button
                    type="submit"
                    className={`bg-white border-2 outline-none focus:outline-none hover:opacity-90 w-2/3 text-md font-bold py-2 px-4 my-2 rounded ${loading ? "border-lightgray text-lightgray" : "border-customGreen text-customGreen"}`}
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
