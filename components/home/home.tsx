import { HeroLanding, Logo, LoadingAuth } from "../../assets/icons";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { postSubscribe } from "../../utils/api";

export default function HomeComponent(): JSX.Element {
  const initialValues = {
    email: "",
  };

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
      // Fire and forget
    }
  };
  const [loading, setLoading] = useState<boolean>(false);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);

  return (
    <>
      <div className="grid grid-cols-2 absolute top-0 right-0 left-0 pt-2">
        <a
          href="/"
          className="text-black text-2xl sm:text-3xl md:text-5xl font-bold p-3 text-left"
        >
          <div className="float-left mr-2 h-9 w-9 sm:h-12 sm:w-12 md:h-14 md:w-14">
            <Logo />
          </div>
          <div className="ml-2 pt-2">LINKS</div>
        </a>

        <div className="flex flex-row-reverse p-2">
          <a
            href="/signup"
            className="bg-lightblue flex items-center justify-center rounded shadow-md focus:outline-none text-lg font-bold text-white w-10/12 sm:w-2/7 md:w-1/3"
          >
            Get Started
          </a>
        </div>
      </div>

      <div className="flex justify-center font-sans min-h-screen px-3 sm:px-8 2xl:px-12">
        <div className="grid grid-cols-0 md:grid-cols-2 w-full">
          <div className="md:col-span-1 my-auto block md:hidden">
            <HeroLanding />
          </div>
          <div className="md:col-span-1 my-auto px-5 text-center md:text-left">
            <h1 className="text-5xl sm:text-7xl md:text-6xl lg:text-8xl 2xl:text-9xl customGradientInverse font-bold tracking-wide">
              One LINK,
            </h1>
            <h2 className="mx-auto lg:ml-0 text-3xl sm:text-5xl md:text-4xl lg:text-6xl 2xl:text-7xl font-bold text-lightblue tracking-wide mb-6">
              For all your links
            </h2>
            <p className="text-gray-600 text-md sm:text-xl lg:text-2xl mb-6">
              Lorem ipsum dolor sit amet, consectetur adipiscing. Vestibulum
              rutrum metus at enim congue scelerisque. Sed suscipit metu non
              iaculis semper consectetur adipiscing elit.
            </p>
            <Formik
              initialValues={initialValues}
              onSubmit={(values) => submitHandler(values)}
              validateOnBlur={false}
              validateOnChange={false}
              validationSchema={validationSchema}
            >
              {({ errors }) => (
                <Form>
                  <div className="grid grid-cols-4 pb-5 md:pb-0">
                    <Field
                      name="email"
                      type="email"
                      className="col-span-3 p-2 sm:p-5 md:pt-2 lg:pt-5 rounded-lg outline-none focus:outline-none block appearance-none w-full bg-lightgray"
                      placeholder="abc@example.com"
                    />

                    <button
                      disabled={isSubscribed}
                      type="submit"
                      className={`${
                        isSubscribed
                          ? "bg-backgroundwhiteinset"
                          : "bg-lightblue"
                      } col-span-1 flex items-center justify-center rounded-lg hover:bg-opacity-90 shadow-md focus:outline-none -ml-2 text-sm sm:text-lg md:text-sm lg:text-lg font-bold text-white`}
                    >
                      {loading && (
                        <div className="absolute">
                          <LoadingAuth />
                        </div>
                      )}
                      <div className={`${loading && "invisible"}`}>
                        {isSubscribed ? "Subscribed" : "Subscribe"}
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
          <div className="col-span-1 my-auto hidden md:block">
            <HeroLanding />
          </div>
        </div>
      </div>
    </>
  );
}
