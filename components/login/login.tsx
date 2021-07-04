import React, { useContext, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";

import { postLogin } from "../../utils/api";
import { AuthContext } from "../../store/authContext";
import { Eye, EyeHide } from "../../assets/icons";
import { FloatingCard } from "../shared";

const LoginComponent = () => {
  const { setIsAuth } = useContext(AuthContext);
  const router = useRouter();

  const validationSchema = Yup.object({
    userId: Yup.string().trim().required("This is a required field"),
    password: Yup.string()
      .trim()
      .min(8, "Password should have at least 8 characters")
      .required("This is a required field"),
  });

  type FormData = Partial<Yup.InferType<typeof validationSchema>>;

  const initialValues: FormData = {};

  const submitHandler = async (values: FormData) => {
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

  const togglePasswordVisibility = () => setPasswordShown(!passwordShown);

  return (
    <div className="flex flex-col">
      <FloatingCard
        title="Welcome Back"
        verticalHeader="SIGN IN"
        bottomText="Don't have an account?"
        bottomTextLink="Sign Up"
        linkHref="/signup"
      >
        <Formik
          initialValues={initialValues}
          onSubmit={submitHandler}
          validateOnBlur={false}
          validationSchema={validationSchema}
        >
          {({ errors, touched }) => (
            <Form>
              <h1 className="text-lightgray font-bold">Email or Username</h1>
              <Field
                name="userId"
                type="text"
                className="bg-white border-b-2 border-lightgraycustom text-lightgraycustom font-semibold mb-4 outline-none focus:outline-none w-full px-2 py-2"
              />
              {touched.userId && errors.userId && (
                <div className="text-red-500 text-sm -mt-4 mb-3">
                  {errors.userId}
                </div>
              )}
              <div className="relative">
                <div className="flex justify-between">
                  <h1 className="text-lightgray font-bold">Password</h1>
                  <div className="text-right text-primaryGreen-300 hover:opacity-80 font-semibold">
                    <Link href="/forgotpassword">
                      <a>Forgot?</a>
                    </Link>
                  </div>
                </div>
                <Field
                  name="password"
                  type={passwordShown ? "text" : "password"}
                  className="bg-white border-b-2 border-lightgraycustom text-lightgraycustom font-semibold mb-4 outline-none focus:outline-none w-full px-2 py-2"
                />
                <i
                  className="absolute top-9 right-3 cursor-pointer"
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
              <div className="flex items-center justify-center relative">
                <button
                  type="submit"
                  disabled={Object.keys(errors).length > 0 || loading}
                  className={`bg-white border-2 outline-none focus:outline-none hover:opacity-80 w-2/3 text-md font-bold py-2 px-4 my-6 rounded ${
                    Object.keys(errors).length > 0 || loading
                      ? "border-lightgray text-lightgray"
                      : "border-primaryGreen-200 text-primaryGreen-200"
                  }`}
                >
                  {loading ? "Please wait..." : "SIGN IN"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </FloatingCard>
    </div>
  );
};

export default LoginComponent;
