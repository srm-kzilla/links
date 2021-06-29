//Package imports
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import { useContext, useState } from "react";
import Link from "next/link";

//Local imports
import { errorHandler, postSubscribe } from "../../utils/api";
import { AuthContext } from "../../store/authContext";
import {
  HeroLanding,
  Logo,
  Loading,
  HomeTick,
  Arrow,
} from "../../assets/icons";

export default function HomeComponent(): JSX.Element {
  const initialValues = {
    email: "",
  };

  const { isAuth } = useContext(AuthContext);

  const validationSchema = Yup.object({
    email: Yup.string()
      .trim()
      .email("Email must be a valid email")
      .required("This is a required field"),
  });

  const submitHandler = async (values) => {
    try {
      setLoading(true);
      const res = await postSubscribe(values);
      if (res) {
        setLoading(false);
        setIsSubscribed(true);
      } else {
        setLoading(false);
      }
    } catch (error) {
      errorHandler(error);
    }
  };
  const [loading, setLoading] = useState<boolean>(false);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);

  return (
    <>
      <div className="grid grid-cols-2 absolute top-0 right-0 left-0 pt-2">
        <Link href="/">
          <a className="ml-2 pt-1 text-lightgray text-lg sm:text-2xl font-bold p-3 text-left">
            <div className="float-left mr-2 h-9 w-9 sm:h-12 sm:w-12">
              <Logo />
            </div>
            <div className="ml-2 pt-2">LINKS</div>
          </a>
        </Link>

        <div className="flex flex-row-reverse p-2 mr-2">
          <Link href={isAuth ? "/dashboard" : "/login"}>
            <a className=" flex items-center justify-center bg-white border-2 rounded hover:opacity-80 border-primaryGreen-200 focus:outline-none uppercase text-sm lg:text-lg text-primaryGreen-200 font-bold w-9/12 sm:w-2/7 md:w-1/3 ">
              {isAuth ? "My Dashboard" : "Get Started"}
            </a>
          </Link>
        </div>
      </div>

      <div className="flex justify-center font-sans min-h-screen px-3 sm:px-8 2xl:px-12">
        <div className="grid grid-cols-0 lg:grid-cols-2 w-full">
          <div className="lg:col-span-1 mt-20 mb-10 lg:mb-0 lg:my-auto mx-auto block lg:hidden">
            <HeroLanding />
          </div>
          <div className="text-gray-600 font-Inter lg:col-span-1 md:my-5 lg:my-auto px-5 text-center lg:text-left font-bold ">
            <h1 className="py-3 text-3xl sm:text-5xl md:text-6xl 2xl:text-7xl tracking-wider">
              Your ultimate
            </h1>
            <h2 className="py-3 lg:ml-0 text-3xl sm:text-5xl md:text-6xl 2xl:text-7xl tracking-wider mb-10 lg:mb-24">
              URL <span className="text-primaryGreen-200">warehouse</span>
            </h2>

            <Formik
              initialValues={initialValues}
              onSubmit={(values) => submitHandler(values)}
              validateOnBlur={false}
              validateOnChange={false}
              validationSchema={validationSchema}
            >
              {({ errors, touched }) => (
                <Form>
                  <div className="grid grid-cols-8 text-center sm:text-left">
                    <Field
                      name="email"
                      type="email"
                      className="col-span-7 lg:col-span-5 p-2 sm:p-7 md:pt-2 lg:pt-5 border-primaryGreen-200 border-l-8 focus:outline-none block w-full bg-lightgray-10"
                      placeholder="abc@example.com"
                    />

                    <button
                      disabled={isSubscribed}
                      type="submit"
                      className="bg-primaryGreen-100 col-span-1 flex items-center justify-center hover:bg-opacity-90 -ml-2 focus:outline-none"
                    >
                      {loading && (
                        <div className="absolute">
                          <Loading />
                        </div>
                      )}
                      <div className={`${loading ? "invisible" : ""}`}>
                        {isSubscribed ? <HomeTick /> : <Arrow />}
                      </div>
                    </button>
                  </div>
                  {touched.email && errors.email && (
                    <div className=" text-red-500 text-sm pt-2 pl-2">
                      {errors.email}
                    </div>
                  )}
                </Form>
              )}
            </Formik>
            <h1 className="py-3 mb-5 text-left text-md sm:text-xl md:text-2xl 2xl:text-4xl tracking-wider">
              Subscribe to mailer
            </h1>
          </div>
          <div className="col-span-1 my-auto hidden lg:block">
            <HeroLanding />
          </div>
        </div>
      </div>
    </>
  );
}
