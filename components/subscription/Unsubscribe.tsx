import Lottie from "react-lottie";
import Link from "next/link";
import animationData from "../../public/lotties/unsubscribe.json";

export default function UnsubscribeComponent(): JSX.Element {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };
  return (
    <>
      <div className="flex h-screen">
        <div className="m-auto w-full">
          <div className="flex flex-col items-center justify-center p-4">
            <Lottie
              options={defaultOptions}
              height={150}
              width={150}
            />
            <h1 className="font-bold text-xl sm:text-3xl text-center mt-4">Sad to see you go!</h1>
          </div>
          <p className="w-full text-center mt-8 text-md sm:text-lg px-1">
          You have been unsubscribed from the mailing list
          </p>
          <div className="text-center">
            <Link href="/">
              <a>
                <button className="bg-white border-2 border-statusGreen text-statusGreen font-bold outline-none focus:outline-none hover:opacity-80 w-2/3 sm:w-1/5 text-md py-3 px-4 my-10 rounded-md">
                  TAKE ME HOME
                </button>
              </a>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
