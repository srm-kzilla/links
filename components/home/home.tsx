import {
  HeroLanding,
  Logo,
  LoadingAuth,
  HomeTick,
  Arrow,
} from "../../assets/icons";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import { useContext, useState } from "react";
import { errorHandler, postSubscribe } from "../../utils/api";
import { AuthContext } from "../../store/authContext";

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
        <a
          href="/"
          className="ml-2 pt-1 text-lightgray text-lg sm:text-2xl font-bold p-3 text-left"
        >
          <div className="float-left mr-2 h-9 w-9 sm:h-12 sm:w-12">
            <Logo />
          </div>
          <div className="ml-2 pt-2">LINKS</div>
        </a>

        <div className="flex flex-row-reverse p-2 mr-2">
          <a
            href={isAuth ? "/dashboard" : "/login"}
            className=" flex items-center justify-center bg-white border-2 rounded hover:opacity-80 border-statusGreen focus:outline-none uppercase text-md lg:text-lg text-statusGreen font-bold w-8/12 sm:w-2/7 md:w-1/3 "
          >
            {isAuth ? "My Dashboard" : "Get Started"}
          </a>
        </div>
      </div>

      <div className="flex justify-center font-sans min-h-screen px-3 sm:px-8 2xl:px-12">
        <div className="grid grid-cols-0 lg:grid-cols-2 w-full">
          <div className="lg:col-span-1 my-auto py-20 block lg:hidden">
            <HeroLanding />
          </div>
          <div className="text-gray-600 font-Inter lg:col-span-1 my-auto px-5 text-center lg:text-left font-bold ">
            <h1 className="py-3 text-4xl sm:text-5xl md:text-6xl 2xl:text-7xl tracking-wider">
              Your ultimate
            </h1>
            <h2 className="py-3 lg:ml-0 text-4xl sm:text-5xl md:text-6xl 2xl:text-7xl tracking-wider mb-24">
              URL <span className="text-statusGreen">warehouse</span>
            </h2>

            <Formik
              initialValues={initialValues}
              onSubmit={(values) => submitHandler(values)}
              validateOnBlur={false}
              validateOnChange={false}
              validationSchema={validationSchema}
            >
              {({ errors }) => (
                <Form>
                  <div className="grid grid-cols-8 pb-5 md:pb-0">
                    <Field
                      name="email"
                      type="email"
                      className="col-span-5 p-2 sm:p-7 md:pt-2 lg:pt-5 border-statusGreen border-l-8 focus:outline-none block w-full bg-lightestgray"
                      placeholder="abc@example.com"
                    />

                    <button
                      disabled={isSubscribed}
                      type="submit"
                      className="bg-lightestGreen col-span-1 flex items-center justify-center hover:bg-opacity-90 -ml-2 focus:outline-none"
                    >
                      {loading && (
                        <div className="absolute">
                          <LoadingAuth />
                        </div>
                      )}
                      <div className={`${loading ? "invisible" : ""}`}>
                        {isSubscribed ? <HomeTick /> : <Arrow />}
                      </div>
                    </button>
                  </div>
                  {errors.email && (
                    <div className=" text-red-500 text-sm pt-2 pl-2">
                      {errors.email}
                    </div>
                  )}
                </Form>
              )}
            </Formik>
          </div>
          <div className="col-span-1 my-auto hidden lg:block">
            <HeroLanding />
          </div>
        </div>
      </div>
    </>
  );
}
