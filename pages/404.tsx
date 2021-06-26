import Link from "next/link";

import {
  NotFoundLeft,
  NotFoundZero,
  NotFoundRight,
  LinksLogoBg,
} from "../assets/icons";
export default function Custom404() {
  return (
    <>
      <div className="flex min-h-screen">
        <div className="container mx-auto px-6 sm:px-12 flex flex-col sm:flex-row items-center justify-center">
          <div className="sm:w-3/5 m-2 flex justify-center">
            <div className="flex items-center justify-evenly w-4/5 max-w-lg">
              <NotFoundLeft />
              <div className="animate-bounce">
                <NotFoundZero />
              </div>
              <NotFoundRight />
            </div>
          </div>
          <div className="sm:w-2/5 flex flex-col items-start mt-8 sm:mt-0 text-center sm:text-left">
            <h1 className="w-full my-4 font-Inter text-6xl font-black text-primaryGreen-200-300">
              Oops!
            </h1>
            <h1 className="font-Inter text-6xl font-black text-lightgray">
              The page was
            </h1>
            <h1 className="w-full font-Inter text-6xl font-black text-lightgray">
              not found<span className="text-primaryGreen-200-300">.</span>
            </h1>

            <Link href="/">
              <a className="w-full text-center sm:text-left">
                <button className="bg-white border-2 border-primaryGreen-200-300 text-primaryGreen-200-300 outline-none focus:outline-none font-bold px-6 py-2 mt-10 rounded-md">
                  TAKE ME HOME
                </button>
              </a>
            </Link>
          </div>
        </div>
      </div>

      <div className="hidden lg:block absolute bottom-0 z-0">
        <LinksLogoBg />
      </div>
    </>
  );
}
