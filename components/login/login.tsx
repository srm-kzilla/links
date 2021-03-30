import React, { useContext } from "react";
import { useRouter } from "next/router";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";

import { postLogin } from "../../utils/api";
import { AuthContext } from "../../utils/authContext";

const LoginComponent = () => {
  const { setIsAuth } = useContext(AuthContext);
  const router = useRouter();

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .trim()
      .email("Email must be a valid email")
      .required("This is a required field"),
    password: Yup.string()
      .trim()
      .min(8, "Password should have at least 8 characters")
      .required("This is a required field"),
  });

  const submitHandler = async (values) => {
    try {
      const res = await postLogin(values);
      if (res) {
        setIsAuth(true);
        router.push("/dashboard");
      }
    } catch (error) { }
  };

  return (
    <div className="mx-auto h-screen flex justify-center items-center">
      <div className="m-auto md:w-2/4 lg:w-1/4">
        <div className="customGradient hidden absolute md:block float-left z-0 styledHeader text-xxl mb-1 text-center">
          LINKS
        </div>
        <div className="relative p-8 border-t-12 bg-white mb-6 rounded-lg shadow-2xl">
          <h1 className="text-center text-4xl mb-5 font-extrabold text-lightblue">
            LOGIN
          </h1>

          <Formik
            initialValues={initialValues}
            onSubmit={(values) => submitHandler(values)}
            validationSchema={validationSchema}>
            {({ errors }) => (
              <Form>
                <Field
                  name="email"
                  type="email"
                  className="gradientInput mb-4 outline-none focus:outline-none block appearance-none w-full bg-lightgray px-2 py-2"
                  placeholder="Your Email ID"
                />
                {errors.email && (
                  <div className="text-red-500 text-sm -mt-4 mb-3">
                    {errors.email}
                  </div>
                )}
                <Field
                  name="password"
                  type="password"
                  className="gradientInput mb-4 outline-none focus:outline-none block appearance-none w-full bg-lightgray px-2 py-2"
                  placeholder="Your Password"
                />
                {errors.password && (
                  <div className="text-red-500 text-sm -mt-4 mb-3">
                    {errors.password}
                  </div>
                )}
                <div className="flex items-center justify-center">
                  <button
                    type="submit"
                    className="bg-lightblue outline-none focus:outline-none hover:bg-opacity-90 text-darkgray w-2/3 text-md shadow-lg font-extrabold py-2 px-4 my-2 rounded"
                  >
                    Let's Go!
                  </button>
                </div>
                <div className="text-center text-darkgray hover:text-black font-normal mt-3 pb-6 ">
                  <a href="#">Forgot Password?</a>
                </div>
                <div className="w-full mx-auto py-4 text-black h-auto bg-blue flex justify-center items-center">
                  <hr className="w-1/5 sm:w-1/4 lg:w-96" />
                  <p className="mx-3 md:mx-6 text-sm text-darkgray">OR</p>
                  <hr className="w-1/5 sm:w-1/4 lg:w-96" />
                </div>
              </Form>
            )}
          </Formik>

          <div className="text-center">
            <p className="text-darkgray hover:text-black text-sm">
              Don't have an account?{" "}
              <a href="/signup" className="no-underline text-blue font-bold">
                Sign Up!
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;
