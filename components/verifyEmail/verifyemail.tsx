import { setCookie } from "nookies";

export default function VerifyEmailComponent({ authTokenProp }): JSX.Element {
  setCookie(null, "authToken", authTokenProp);
  return (
    <>
      <div className="flex w-screen h-screen">
        <div className="m-auto w-full">
          <div className="flex flex-col items-center justify-center p-4">
              <h1 className="text-7xl sm:text-9xl my-2">✔️</h1>
              <h1 className="font-bold text-xl sm:text-3xl text-center">Your Email is now verified!</h1>
          </div>
          <p className="w-full text-center mt-8 text-md sm:text-lg">
            You can now continue to add your links in your dashboard! 🥳
          </p>
          <div className="text-center">
            <a href="/dashboard">
              <button className="bg-lightblue focus:outline-none hover:bg-opacity-90 text-darkgray w-2/3 sm:w-1/5 text-md shadow-lg font-extrabold py-3 px-4 my-10 rounded">
                TAKE ME TO DASHBOARD
              </button>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
