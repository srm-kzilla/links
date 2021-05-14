import React, { useContext, useState } from "react";
import { useRouter } from "next/router";
import { Formik, Field, Form } from "formik";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as Yup from "yup";

import { postSignup } from "../../utils/api";
import { AuthContext } from "../../utils/authContext";
import { Ellipse, Eye, EyeHide, LoadingAuth } from "../../assets/icons"

const SignUpComponent = () => {
  const { setIsAuth } = useContext(AuthContext);
  const router = useRouter();

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
    confirmPassword: Yup.string().oneOf(
      [Yup.ref("password"), null],
      "Passwords must match"
    ),
  });

  const submitHandler = async (values) => {
    try {
      setLoading(true);
      delete values.confirmPassword;
      const res = await postSignup(values);
      if (res) {
        setIsAuth(true);
        router.push("/dashboard");
      }
      else {
        setLoading(false);
      }
    }
    // Fire and forget
    catch (error) { }
  };
  const [passwordShown, setPasswordShown] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const togglePasswordVisiblity = () => {
    setPasswordShown(passwordShown ? false : true);
  };

  return (
    <div className="mx-auto h-screen flex justify-center items-center">
      <div className="m-auto md:w-2/4 lg:w-1/4 relative z-10">
        <div className="customGradient hidden absolute md:block float-left z-0 styledHeader text-xxl mb-1 text-center">
          LINKS
        </div>
        <div className="relative p-8 border-t-12 bg-white mb-6 rounded-lg shadow-2xl">
          <h1 className="text-center text-4xl mb-5 font-extrabold text-lightblue">
            SIGN UP
          </h1>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
          <Formik
            initialValues={initialValues}
            onSubmit={(values) => submitHandler(values)}
            validationSchema={validationSchema}
          >
            {({ errors }) => (
              <Form>
                <Field
                  name="email"
                  type="email"
                  className="gradientInput mb-4 outline-none focus:outline-none block appearance-none w-full bg-lightgray px-2 py-2 rounded shadow"
                  placeholder="Your Email ID"
                />
                {errors.email && (
                  <div className="text-red-500 text-sm -mt-4 mb-3">
                    {errors.email}
                  </div>
                )}
                <Field
                  name="username"
                  type="text"
                  className="gradientInput mb-4 outline-none focus:outline-none block appearance-none w-full bg-lightgray px-2 py-2 rounded shadow"
                  placeholder="Your Username"
                />
                {errors.username && (
                  <div className="text-red-500 text-sm -mt-4 mb-3">
                    {errors.username}
                  </div>
                )}
                <div className="relative">
                  <Field
                    name="password"
                    type={passwordShown ? 'text' : 'password'}
                    className="gradientInput mb-4 outline-none focus:outline-none block appearance-none w-full bg-lightgray px-2 py-2 rounded shadow"
                    placeholder="Your Password"
                  />
                  <i className="absolute top-4 right-3 cursor-pointer" onClick={togglePasswordVisiblity}>{passwordShown ? <EyeHide /> : <Eye />}</i>
                </div>
                {errors.password && (
                  <div className="text-red-500 text-sm -mt-4 mb-3">
                    {errors.password}
                  </div>
                )}
                <Field
                  name="confirmPassword"
                  type="password"
                  className="gradientInput mb-4 outline-none focus:outline-none block appearance-none w-full bg-lightgray px-2 py-2 rounded shadow"
                  placeholder="Confirm Password"
                />
                {errors.confirmPassword && (
                  <div className="text-red-500 text-sm -mt-4 mb-3">
                    {errors.confirmPassword}
                  </div>
                )}
                <div className="flex items-center justify-center relative">
                  <button
                    type="submit"
                    className="bg-lightblue outline-none focus:outline-none hover:bg-opacity-90 text-darkgray w-2/3 text-md shadow-lg font-extrabold py-2 px-4 my-2 rounded"
                  >
                  {loading && <div className="absolute left-37 top-4"><LoadingAuth /></div>}<div className={`${loading && "invisible"}`}>Sign Me Up!</div>
                  </button>
                </div>
              </Form>
            )}
          </Formik>

          <div className="text-center mt-4">
            <p className="text-darkgray hover:text-black text-sm">
              Already have an account?{" "}
              <a href="/login" className="no-underline text-blue font-bold">
                Login!
              </a>
            </p>
          </div>
        </div>
      </div>
      <div className="hidden md:block absolute -bottom-5 right-0 z-0">
        <Ellipse />
      </div>
    </div>
  );
};

export default SignUpComponent;
