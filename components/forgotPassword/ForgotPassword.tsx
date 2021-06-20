import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import { Formik, Field, Form } from "formik";
import VerificationInput from "react-verification-input";

import { postForgotPasswordEmail, postVerifyOtp, patchNewForgotPassword } from "../../utils/api";
import { forgotPasswordEmailValidationSchema, forgotPasswordValidationSchema } from "../../utils/schema";
import { Eye, EyeHide } from "../../assets/icons";
import { resetPasswordToken, resendOtpEmail } from "../../utils/store";

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
  const [isSubmittingPassword, setIsSubmittingPassword] = useState<boolean>(false);
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
      newPassword: newPassword
    }
    const _res = await patchNewForgotPassword(resetPwdToken, values);
    if (_res) {
      setIsSubmittingPassword(false);
      router.replace('/login');
    }
    setIsSubmittingPassword(false);
  };

  return (
    <>
      {enterCode ? (
        <>
          <div className="absolute text-2xl lg:text-5xl -top-20 left-5 gradientHeaderHollow">
            <h1>FORGOT PASSWORD</h1>
          </div>
          <div className="flex items-center justify-center flex-col h-screen">
            {otpVerified && (
              <>
                <p className="flex-initial mt-24 mb-4 text-darkgray font-extrabold">
                  ENTER VERIFICATION CODE
            </p>
                <VerificationInput
                  removeDefaultStyles
                  length={6}
                  validChars="0-9"
                  autoFocus={true}
                  placeholder=""
                  inputField={{
                    onChange: getOtpValue,
                  }}
                  container={{
                    className: "w-full md:w-2/5 text-center",
                  }}
                  characters={{
                    className: "h-14 md:h-20 font-extrabold text-4xl md:text-6xl",
                  }}
                  character={{
                    className: "mx-2 shadow-md rounded-xl pt-2",
                    classNameInactive: "bg-statusGreen rounded-md cursor-text",
                    classNameSelected: "focus: ring rounded-md",
                  }}
                />
                {counter != 0 && (
                  <h1 className="mt-5">Resend OTP in: {counter}s</h1>
                )}
                {counter == 0 && (
                  <button 
                    className={`focus:outline-none ${disableResendOtp && "opacity-50"}`} 
                    disabled={disableResendOtp}
                    onClick={() => {
                      sendVerificationCode(forgotPwdEmail)
                      setDisableResendOtp(true)
                    }}>
                    <h1 className="mt-5">Resend OTP</h1>
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isSubmittingOtp}
                  className={`${isSubmittingOtp ? "bg-backgroundwhiteinset" : "bg-lightblue"} focus:outline-none hover:bg-opacity-90 text-darkgray w-2/3 md:w-1/5 text-md shadow-lg font-extrabold py-3 px-4 my-10 rounded`}
                  onClick={() => verifyOtp()}
                >
                  {isSubmittingOtp ? "Please wait..." : "VERIFY"}
                </button>
              </>)}
            {changePassword && (
              <div className="w-2/3 md:w-3/12">
                <Formik
                  initialValues={initialValues}
                  onSubmit={(values) => submitNewPassword(values.newPassword)}
                  validateOnBlur={false}
                  validateOnChange={false}
                  validationSchema={forgotPasswordValidationSchema}
                >
                  {({ errors }) => (
                    <Form>
                      <p className="flex-initial text-darkgray font-extrabold mt-20">
                        NEW PASSWORD
                      </p>
                      <div className="relative">
                        <Field
                          type={passwordShown ? 'text' : 'password'}
                          name="newPassword"
                          autoComplete="off"
                          className="gradientInputBottom p-1 focus:outline-none bg-backgroundwhite w-full mt-2 mb-8"
                        />
                        <i
                          className="absolute top-4 right-3 cursor-pointer"
                          onClick={togglePasswordVisiblity}
                        >
                          {passwordShown ? <EyeHide /> : <Eye />}
                        </i>
                      </div>
                      {errors.newPassword && (
                        <div className="text-red-500 text-sm -mt-7 mb-6">
                          {errors.newPassword}
                        </div>
                      )}

                      <p className="flex-initial text-darkgray font-extrabold">
                        CONFIRM NEW PASSWORD
                      </p>
                      <Field
                        type="password"
                        name="confirmNewPassword"
                        autoComplete="off"
                        className="gradientInputBottom p-1 focus:outline-none bg-backgroundwhite w-full mt-2 mb-8"
                      />
                      {errors.confirmNewPassword && (
                        <div className="text-red-500 text-sm -mt-7">
                          {errors.confirmNewPassword}
                        </div>
                      )}
                      <div className="flex items-center justify-center relative">
                        <button
                          type="submit"
                          disabled={isSubmittingPassword}
                          className={`${isSubmittingPassword ? "bg-backgroundwhiteinset" : "bg-statusGreen"} focus:outline-none hover:bg-opacity-90 text-darkgray w-full text-md shadow-lg font-extrabold py-3 px-4 my-14 rounded`}
                        >
                          {isSubmittingPassword ? "Please wait..." : "Save"}
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="absolute text-2xl lg:text-5xl top-20 left-5 gradientHeaderHollow">
            <h1>FORGOT PASSWORD</h1>
          </div>
          <div className="flex flex-col w-2/3 md:w-2/6 mx-auto">
            <p className="text-center mt-64 text-darkgray font-extrabold">
              EMAIL
            </p>
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
                    <Field
                      type="email"
                      name="email"
                      className="gradientInputBottom p-1 focus:outline-none bg-backgroundwhite mt-8 mb-8"
                      placeholder="abc@xyzmail.com"
                    />
                    {errors.email && (
                      <div className="text-red-500 text-sm -mt-4 mb-3">
                        {errors.email}
                      </div>
                    )}
                    <button
                      type="submit"
                      disabled={isSubmittingEmail}
                      className={`${isSubmittingEmail ? "bg-backgroundwhiteinset" : "bg-lightblue"} focus:outline-none hover:bg-opacity-90 text-darkgray text-md shadow-lg font-extrabold py-3 px-4 my-10 rounded`}
                    >
                      {isSubmittingEmail ? "Please wait..." : "Send Verification Code"}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </>
      )}
    </>
  );
}
