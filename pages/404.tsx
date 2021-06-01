import { NotFoundLeft, NotFoundZero, NotFoundRight } from "../assets/icons";

export default function Custom404() {
  return (
    <>
      <div className="flex h-screen">
        <div className="m-auto w-full">
          <div className="flex items-center justify-center p-4">
            <NotFoundLeft />
            <div className="animate-bounce">
              <NotFoundZero />
            </div>
            <NotFoundRight />
          </div>
          <p className="w-full text-center mt-8 text-sm">
            Oops! This page is not found!
          </p>
          <div className="text-center">
            <a href="/">
              <button
                className="bg-lightblue focus:outline-none hover:bg-opacity-90 text-darkgray w-2/3 sm:w-1/5 text-md shadow-lg font-extrabold py-3 px-4 my-10 rounded">
                TAKE ME HOME!
              </button>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}