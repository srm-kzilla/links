import { useState } from "react";
import { useRouter } from "next/router";
import VerificationInput from "react-verification-input";
import { Formik, Field, Form } from "formik";
import { useRecoilState } from "recoil";

import { postForgotPasswordEmail, postVerifyOtp, patchNewForgotPassword } from "../../utils/api";
import { forgotPasswordValidationSchema } from "../../utils/schema";
import { Eye, EyeHide, LoadingAuth } from "../../assets/icons";
import { resetPasswordToken } from "../../utils/store";

export default function ForgotPasswordComponent(): JSX.Element {
  const [passwordShown, setPasswordShown] = useState<boolean>(false);
  const togglePasswordVisiblity = () => {
    setPasswordShown(passwordShown ? false : true);
  };

  const router = useRouter();

  const [enterCode, setEnterCode] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [otp, setOtp] = useState<number>();
  const [changePassword, setChangePassword] = useState<boolean>(false);
  const [otpVerified, setOtpVerified] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  const [resetPwdToken, setResetPwdToken] = useRecoilState(resetPasswordToken);

  const initialValues = {
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  };

  const sendVerificationCode = async () => {
    const values = {
      email: email,
    };
    const _res = await postForgotPasswordEmail(values);
    if (_res) {
      setEnterCode(true);
      setResetPwdToken(_res.data.resetPasswordToken);
    }
  };

  const getOtpValue = (e) => {
    if (e.nativeEvent.target.value.length === 6) {
      setOtp(Number(e.nativeEvent.target.value));
    }
  };

  const verifyOtp = async () => {
    const values = {
      otp: otp,
    };
    const _res = await postVerifyOtp(resetPwdToken, values);
    if (_res) {
      setChangePassword(true);
      setOtpVerified(false);
    }
  };

  const submitNewPassword = async (newPassword: string) => {
    setLoading(true);
    const values = {
      newPassword: newPassword
    }
    const _res = await patchNewForgotPassword(resetPwdToken, values);
    if (_res) {
      setLoading(false);
      router.replace('/login');
    }
    setLoading(false);
  };

  return (
    <>
      {enterCode ? (
        <>
          <div className="absolute text-2xl lg:text-5xl -top-6 left-4 gradientHeaderHollow">
            <h1>FORGOT PASSWORD</h1>
          </div>
          <div className="flex items-center justify-center flex-col mt-24">
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
                    className: "mx-2 shadow-md rounded-xl",
                    classNameInactive: "bg-statusGreen rounded-xl cursor-text",
                    classNameSelected: "border-4 border-indigo-600 rounded-xl",
                  }}
                />
                <button
                  type="submit"
                  className="bg-lightblue focus:outline-none hover:bg-opacity-90 text-darkgray w-2/3 md:w-1/5 text-md shadow-lg font-extrabold py-3 px-4 my-10 rounded"
                  onClick={() => verifyOtp()}
                >
                  VERIFY
            </button>
              </>)}
            {changePassword && (
              <div className="w-2/3 md:w-3/12">
                <Formik
                  initialValues={initialValues}
                  onSubmit={(values) => submitNewPassword(values.newPassword)}
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
                        <div className="text-red-500 text-sm -mt-4 mb-3">
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
                        <div className="text-red-500 text-sm -mt-4 mb-3">
                          {errors.confirmNewPassword}
                        </div>
                      )}
                      <div className="flex items-center justify-center relative">
                        <button
                          type="submit"
                          className="bg-statusGreen focus:outline-none hover:bg-opacity-90 text-darkgray mt-20 w-full text-md shadow-lg font-extrabold py-3 px-4 my-10 rounded"
                        >
                          {loading && <div className="absolute left-1/2"><LoadingAuth /></div>}<div className={`${loading && "invisible"}`}>Save</div>
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
          <div className="absolute text-2xl lg:text-5xl top-20 left-4 gradientHeaderHollow">
            <h1>FORGOT PASSWORD</h1>
          </div>
          <div className="flex items-center justify-center flex-col">
            <p className="flex-initial mt-64 text-darkgray font-extrabold">
              EMAIL
            </p>
            <form className="flex items-center justify-center flex-col h-full w-full">
              <input
                type="email"
                name="email"
                value={email}
                autoComplete="off"
                className="gradientInputBottom p-1 focus:outline-none bg-backgroundwhite w-3/4 md:w-1/5 mt-8 mb-8"
                placeholder="abc@xyzmail.com"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button
                type="submit"
                className="bg-lightblue focus:outline-none hover:bg-opacity-90 text-darkgray w-2/3 md:w-1/5 text-md shadow-lg font-extrabold py-3 px-4 my-10 rounded"
                onClick={() => sendVerificationCode()}
              >
                Send Verification Code
            </button>
            </form>
          </div>
        </>
      )}
    </>
  );
}
