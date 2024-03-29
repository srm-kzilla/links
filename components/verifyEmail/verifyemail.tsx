import { setCookie } from "nookies";
import Link from "next/link";
import Lottie from "react-lottie";

import animationData from "../../public/lotties/success.json";

export default function VerifyEmailComponent({ authTokenProp }): JSX.Element {
  setCookie(null, "authToken", authTokenProp);
  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <>
      <div className="flex h-screen">
        <div className="m-auto w-full">
          <div className="flex flex-col items-center justify-center p-4">
            <Lottie options={defaultOptions} height={300} width={300} />
            <h1 className="font-bold text-xl sm:text-3xl text-center">
              Your Email is now verified!
            </h1>
          </div>
          <p className="w-full text-center mt-8 text-md sm:text-lg">
            You can now continue to add your links in your dashboard! 🥳
          </p>
          <div className="text-center">
            <Link href="/dashboard">
              <a>
                <button className="bg-white border-2 border-primaryGreen-200 text-primaryGreen-200 font-bold outline-none focus:outline-none hover:opacity-80 w-2/3 sm:w-1/5 text-md py-3 px-4 my-10 rounded-md">
                  TAKE ME TO DASHBOARD
                </button>
              </a>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
