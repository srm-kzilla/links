import React, { useContext, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";

import { postLogin } from "../../utils/api";
import { AuthContext } from "../../store/authContext";
import { Eye, EyeHide, LoadingAuth } from "../../assets/icons";

const LoginComponent = () => {
  const { setIsAuth } = useContext(AuthContext);
  const router = useRouter();

  const initialValues = {
    userId: "",
    password: "",
  };

  const validationSchema = Yup.object({
    userId: Yup.string().trim().required("This is a required field"),
    password: Yup.string()
      .trim()
      .min(8, "Password should have at least 8 characters")
      .required("This is a required field"),
  });

  const submitHandler = async (values) => {
    try {
      setLoading(true);
      const res = await postLogin(values);
      if (res) {
        setIsAuth(true);
        router.push("/dashboard");
      }
      setLoading(false);
      //* INFO: fire and forget
    } catch (error) {}
  };

  const [passwordShown, setPasswordShown] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const togglePasswordVisibility = () => {
    setPasswordShown(passwordShown ? false : true);
  };

  return (
    <div className="min-h-screen flex justify-center">
      <div className="m-auto md:w-2/4 lg:w-1/4 relative z-10">
        <div className="customGradient styledHeader hidden absolute md:block float-left z-0  text-xxl text-center">
          LINKS
        </div>
        <div className="relative p-8 border-t-12 bg-white mb-6 rounded-lg shadow-2xl">
          <h1 className="text-center text-4xl mb-5 font-extrabold text-lightblue">
            LOGIN
          </h1>

          <Formik
            initialValues={initialValues}
            onSubmit={(values) => submitHandler(values)}
            validateOnBlur={false}
            validateOnChange={false}
            validationSchema={validationSchema}
          >
            {({ errors }) => (
              <Form>
                <Field
                  name="userId"
                  type="text"
                  className="gradientInput mb-4 outline-none focus:outline-none block appearance-none w-full bg-lightgray px-2 py-2"
                  placeholder="Email ID / Username"
                />
                {errors.userId && (
                  <div className="text-red-500 text-sm -mt-4 mb-3">
                    {errors.userId}
                  </div>
                )}
                <div className="relative">
                  <Field
                    name="password"
                    type={passwordShown ? "text" : "password"}
                    className="gradientInput mb-4 outline-none focus:outline-none block appearance-none w-full bg-lightgray px-2 py-2"
                    placeholder="Your Password"
                  />
                  <i
                    className="absolute top-4 right-3 cursor-pointer"
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
                <div className="flex items-center justify-center relative">
                  <button
                    type="submit"
                    className="bg-lightblue outline-none focus:outline-none hover:bg-opacity-90 text-darkgray w-2/3 text-md shadow-lg font-extrabold py-2 px-4 my-2 rounded"
                  >
                    {loading && (
                      <div className="absolute left-24 sm:left-37 top-4">
                        <LoadingAuth />
                      </div>
                    )}
                    <div className={`${loading ? "invisible" : ""}`}>Let's Go!</div>
                  </button>
                </div>
                <div className="text-center text-darkgray hover:text-black font-normal mt-3 pb-6 ">
                  <a href="/forgotpassword">Forgot Password?</a>
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
              <Link href="/signup">
                <a className="no-underline text-blue font-bold">Sign Up!</a>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;
