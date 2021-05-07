import { useState } from "react";
import VerificationInput from "react-verification-input";

import { EllipseGreen } from "../../assets/icons";

export default function ForgotPasswordComponent(): JSX.Element {
  const [enterCode, setEnterCode] = useState<boolean>(false);

  return (
    <>
      {enterCode ? (
        <>
          <div className="absolute text-2xl lg:text-5xl -top-40 left-4 gradientHeaderHollow">
            <h1>FORGOT PASSWORD</h1>
          </div>
          <div className="flex items-center justify-center flex-col mt-56">
            <p className="flex-initial mt-2 mb-4 text-darkgray font-extrabold">
              ENTER VERIFICATION CODE
            </p>
            <VerificationInput
              removeDefaultStyles
              length={6}
              validChars="0-9"
              autoFocus={true}
              placeholder=""
              container={{
                className: "w-full md:w-2/5 text-center",
              }}
              characters={{
                className: "h-14 md:h-20 font-extrabold text-4xl md:text-6xl",
              }}
              character={{
                className: "mx-2 shadow-md rounded-xl",
                classNameInactive: "bg-statusGreen rounded-xl cursor-text",
                classNameSelected: "border-4 border-indigo-600 rounded-xl",
              }}
            />
            <button
              type="submit"
              className="bg-lightblue focus:outline-none hover:bg-opacity-90 text-darkgray w-2/3 md:w-1/5 text-md shadow-lg font-extrabold py-3 px-4 my-10 rounded"
              onClick={() => setEnterCode(true)}
            >
              VERIFY
            </button>
            <div className="h-48">
              {/* <p className="flex-initial mt-64 text-darkgray font-extrabold">
                EMAIL
              </p>
              <input
                type="email"
                name="email"
                autoComplete="off"
                className="gradientInputBottom p-1 focus:outline-none bg-backgroundwhite w-2/3 sm:w-1/4 mt-8 mb-8"
                placeholder="abc@xyzmail.com"
              /> */}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="absolute text-2xl lg:text-5xl top-20 left-4 gradientHeaderHollow">
            <h1>FORGOT PASSWORD</h1>
          </div>
          <div className="flex items-center justify-center flex-col">
            <p className="flex-initial mt-64 text-darkgray font-extrabold">
              EMAIL
            </p>
            <input
              type="email"
              name="email"
              autoComplete="off"
              className="gradientInputBottom p-1 focus:outline-none bg-backgroundwhite w-2/3 sm:w-1/4 mt-8 mb-8"
              placeholder="abc@xyzmail.com"
            />
            <button
              type="submit"
              className="bg-lightblue focus:outline-none hover:bg-opacity-90 text-darkgray w-2/3 md:w-1/5 text-md shadow-lg font-extrabold py-3 px-4 my-10 rounded"
              onClick={() => setEnterCode(true)}
            >
              Send Verification Code
            </button>
          </div>
        </>
      )}
      <div className="hidden md:block absolute -left-24 z-0">
        <EllipseGreen />
      </div>
    </>
  );
}
