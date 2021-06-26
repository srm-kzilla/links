import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import { Formik, Field, Form } from "formik";
import Link from "next/link";
import VerificationInput from "react-verification-input";

import {
  postForgotPasswordEmail,
  postVerifyOtp,
  patchNewForgotPassword,
} from "../../utils/api";
import {
  forgotPasswordEmailValidationSchema,
  forgotPasswordValidationSchema,
} from "../../utils/schema";
import { Eye, EyeHide } from "../../assets/icons";
import { resetPasswordToken, resendOtpEmail } from "../../utils/store";
import { FloatingCard } from "../shared";

export default function ForgotPasswordComponent(): JSX.Element {
  const [passwordShown, setPasswordShown] = useState<boolean>(false);
  const togglePasswordVisiblity = () => {
    setPasswordShown(passwordShown ? false : true);
  };

  const router = useRouter();

  const [enterCode, setEnterCode] = useState<boolean>(false);
  const [otp, setOtp] = useState<number>();
  const [counter, setCounter] = useState<number>(120);
  const [changePassword, setChangePassword] = useState<boolean>(false);
  const [otpVerified, setOtpVerified] = useState<boolean>(true);
  const [isSubmittingEmail, setIsSubmittingEmail] = useState<boolean>(false);
  const [isSubmittingOtp, setIsSubmittingOtp] = useState<boolean>(false);
  const [isSubmittingPassword, setIsSubmittingPassword] =
    useState<boolean>(false);
  const [disableResendOtp, setDisableResendOtp] = useState<boolean>(false);

  const [resetPwdToken, setResetPwdToken] = useRecoilState(resetPasswordToken);
  const [forgotPwdEmail, setForgotPwdEmail] = useRecoilState(resendOtpEmail);

  const initialValues = {
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  };

  const emailInitialValue = {
    email: "",
  };

  useEffect(() => {
    counter > 0 && setTimeout(() => setCounter(counter - 1), 1000);
  }, [counter]);

  const sendVerificationCode = async (email: string) => {
    setIsSubmittingEmail(true);
    setForgotPwdEmail(email);
    const values = {
      email: email,
    };
    const _res = await postForgotPasswordEmail(values);
    if (_res) {
      setIsSubmittingEmail(false);
      setEnterCode(true);
      setResetPwdToken(_res.data.resetPasswordToken);
    }
    setIsSubmittingEmail(false);
  };

  const getOtpValue = (e) => {
    if (e.nativeEvent.target.value.length === 6) {
      setOtp(Number(e.nativeEvent.target.value));
    }
  };

  const verifyOtp = async () => {
    setIsSubmittingOtp(true);
    const values = {
      otp: otp,
    };
    const _res = await postVerifyOtp(resetPwdToken, values);
    if (_res) {
      setChangePassword(true);
      setOtpVerified(false);
      setIsSubmittingOtp(false);
    }
    setIsSubmittingOtp(false);
  };

  const submitNewPassword = async (newPassword: string) => {
    setIsSubmittingPassword(true);
    const values = {
      newPassword: newPassword,
    };
    const _res = await patchNewForgotPassword(resetPwdToken, values);
    if (_res) {
      setIsSubmittingPassword(false);
      router.replace("/login");
    }
    setIsSubmittingPassword(false);
  };

  return (
    <>
      {enterCode ? (
        <>
          <div className="flex flex-col min-h-screen">
            {otpVerified && (
              <>
                <FloatingCard
                  title="Verify OTP"
                  verticalHeader="RESET"
                  bottomText="Don't have an account?"
                  bottomTextLink="Sign Up"
                  linkHref="/signup"
                >
                  <div className="flex justify-between my-3">
                    <h1 className="text-lightgray font-bold">Enter OTP</h1>
                    <div className="text-right text-primaryGreen-300 hover:opacity-80 font-bold">
                      {counter !== 0 && <h1>Resend OTP in: {counter}s</h1>}
                      {counter === 0 && (
                        <button
                          className={`font-bold focus:outline-none ${
                            disableResendOtp && "opacity-50"
                          }`}
                          disabled={disableResendOtp}
                          onClick={() => {
                            sendVerificationCode(forgotPwdEmail);
                            setDisableResendOtp(true);
                          }}
                        >
                          <h1>Resend OTP</h1>
                        </button>
                      )}
                    </div>
                  </div>
                  <VerificationInput
                    removeDefaultStyles
                    length={6}
                    validChars="0-9"
                    autoFocus={true}
                    placeholder="•"
                    inputField={{
                      onChange: getOtpValue,
                    }}
                    container={{
                      className: "w-full text-center text-darkgray",
                    }}
                    characters={{
                      className:
                        "h-10 w-full font-extrabold text-xl text-darkgray",
                    }}
                    character={{
                      className:
                        "bg-backgroundwhite mx-1 md:mx-2 rounded-md pt-2 text-darkgray",
                      classNameInactive:
                        "bg-backgroundwhite rounded-md cursor-text text-darkgray",
                      classNameSelected:
                        "bg-backgroundwhite focus: ring rounded-md text-darkgray",
                    }}
                  />
                  <div className="flex justify-between mt-8">
                    <Link href="/">
                      <a>
                        <button className="bg-white border-2 border-statusRed text-statusRed font-bold outline-none focus:outline-none hover:opacity-80 py-2 px-4 rounded">
                          CANCEL
                        </button>
                      </a>
                    </Link>
                    <button
                      type="submit"
                      disabled={isSubmittingOtp}
                      onClick={verifyOtp}
                      className={`${
                        isSubmittingOtp
                          ? "border-lightgray text-lightgray text-xs"
                          : "border-customGreen text-customGreen"
                      } bg-white border-2 focus:outline-none hover:opacity-80 font-bold py-2 px-4 ml-2 rounded`}
                    >
                      {isSubmittingOtp ? "Please wait..." : "PROCEED"}
                    </button>
                  </div>
                </FloatingCard>
              </>
            )}

            {changePassword && (
              <div className="flex flex-col">
                <FloatingCard
                  title="Reset Password"
                  verticalHeader="RESET"
                  bottomText="Don't have an account?"
                  bottomTextLink="Sign Up"
                  linkHref="/signup"
                >
                  <Formik
                    initialValues={initialValues}
                    onSubmit={(values) => submitNewPassword(values.newPassword)}
                    validateOnBlur={false}
                    validateOnChange={false}
                    validationSchema={forgotPasswordValidationSchema}
                  >
                    {({ errors }) => (
                      <Form>
                        <h1 className="text-lightgray font-bold">
                          New Password
                        </h1>
                        <div className="relative">
                          <Field
                            type={passwordShown ? "text" : "password"}
                            name="newPassword"
                            autoComplete="off"
                            className="bg-white border-b-2 border-lightgraycustom text-lightgraycustom font-semibold p-1 focus:outline-none w-full"
                          />
                          <i
                            className="absolute top-2 right-3 cursor-pointer"
                            onClick={togglePasswordVisiblity}
                          >
                            {passwordShown ? <EyeHide /> : <Eye />}
                          </i>
                        </div>
                        {errors.newPassword && (
                          <div className="text-red-500 text-sm">
                            {errors.newPassword}
                          </div>
                        )}

                        <h1 className="text-lightgray font-bold mt-4">
                          Confirm New Password
                        </h1>
                        <Field
                          type="password"
                          name="confirmNewPassword"
                          autoComplete="off"
                          className="bg-white border-b-2 border-lightgraycustom text-lightgraycustom font-semibold p-1 focus:outline-none w-full"
                        />
                        {errors.confirmNewPassword && (
                          <div className="text-red-500 text-sm">
                            {errors.confirmNewPassword}
                          </div>
                        )}
                        <div className="flex justify-between my-8">
                          <Link href="/">
                            <a>
                              <button className="bg-white border-2 border-statusRed text-statusRed font-bold outline-none focus:outline-none hover:opacity-80 py-2 px-4 rounded">
                                CANCEL
                              </button>
                            </a>
                          </Link>
                          <button
                            type="submit"
                            disabled={isSubmittingPassword}
                            className={`${
                              isSubmittingPassword
                                ? "border-lightgray text-lightgray text-xs"
                                : "border-customGreen text-customGreen"
                            } bg-white border-2 font-bold outline-none focus:outline-none hover:opacity-80 py-2 px-4 ml-2 rounded`}
                          >
                            {isSubmittingPassword ? "Please wait..." : "UPDATE"}
                          </button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </FloatingCard>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col">
            <FloatingCard
              title="Verify Account"
              verticalHeader="RESET"
              bottomText="Don't have an account?"
              bottomTextLink="Sign Up"
              linkHref="/signup"
            >
              <Formik
                initialValues={emailInitialValue}
                onSubmit={(values) => sendVerificationCode(values.email)}
                validateOnBlur={false}
                validateOnChange={false}
                validationSchema={forgotPasswordEmailValidationSchema}
              >
                {({ errors }) => (
                  <Form>
                    <div className="flex flex-col">
                      <h1 className="text-lightgray font-bold">Email</h1>
                      <Field
                        type="email"
                        name="email"
                        className="bg-white border-b-2 border-lightgraycustom text-lightgraycustom font-semibold p-1 focus:outline-none my-4"
                        placeholder="abc@xyzmail.com"
                      />
                      {errors.email && (
                        <div className="text-red-500 text-sm -mt-4 mb-3">
                          {errors.email}
                        </div>
                      )}
                      <div className="flex justify-between my-8">
                        <Link href="/">
                          <a>
                            <button className="bg-white border-2 border-statusRed text-statusRed font-bold outline-none focus:outline-none hover:opacity-80 py-2 px-4 rounded">
                              CANCEL
                            </button>
                          </a>
                        </Link>
                        <button
                          type="submit"
                          disabled={isSubmittingEmail}
                          className={`${
                            isSubmittingEmail
                              ? "border-lightgray text-lightgray text-xs"
                              : "border-customGreen text-customGreen"
                          } bg-white border-2 font-bold outline-none focus:outline-none hover:opacity-80 py-2 px-4 ml-2 rounded`}
                        >
                          {isSubmittingEmail ? "Please wait..." : "SEND OTP"}
                        </button>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            </FloatingCard>
          </div>
        </>
      )}
    </>
  );
}
