import React, { useState } from "react";
import Fade from "react-reveal/Fade";
import { parseCookies } from "nookies";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";

import { passwordValidationSchema } from "../../utils/schema";
import { patchNewPassword } from "../../utils/api";
import { Eye, EyeHide } from "../../assets/icons";
import { FloatingCard } from "../shared";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChangePasswordModal = ({ isOpen, onClose }: ModalProps): JSX.Element => {
  const [passwordShown, setPasswordShown] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const togglePasswordVisibility = () => {
    setPasswordShown(passwordShown ? false : true);
  };
  const submitNewPassword = (oldPassword, newPassword) => {
    setLoading(true);
    const values: Object = {
      oldPassword: oldPassword,
      newPassword: newPassword,
    };
    const { authToken } = parseCookies();
    (async () => {
      const _res = await patchNewPassword(authToken, values);
      if (_res) {
        setLoading(false);
        onClose();
      }
      setLoading(false);
    })();
  };

  type FormData = Partial<Yup.InferType<typeof passwordValidationSchema>>;

  const initialValues: FormData = {};

  return (
    <>
      {isOpen && (
        <div className="fixed z-40 top-0 right-0 bottom-0 left-0">
          <div className="fixed top-0 bottom-0 left-0 right-0 z-0 bg-white">
            <Fade bottom duration={200}>
              <div className="flex flex-col">
                <FloatingCard
                  title="Change Password"
                  verticalHeader="PASSWORD"
                  linkHref="/"
                >
                  <Formik
                    initialValues={initialValues}
                    onSubmit={(values) =>
                      submitNewPassword(values.oldPassword, values.newPassword)
                    }
                    validateOnBlur={false}
                    validationSchema={passwordValidationSchema}
                  >
                    {({ errors, touched }) => (
                      <Form>
                        <div className="flex flex-col">
                          <h1 className="text-lightgray font-bold mt-2">
                            Current Password
                          </h1>
                          <Field
                            name="oldPassword"
                            type="password"
                            className="bg-white border-b-2 border-lightgraycustom text-lightgraycustom font-semibold mb-4 outline-none focus:outline-none w-full px-2 py-1"
                            autoFocus
                          />
                          {touched.oldPassword && errors.oldPassword && (
                            <div className="text-red-500 text-sm -mt-4 mb-3">
                              {errors.oldPassword}
                            </div>
                          )}

                          <div className="relative">
                            <div className="flex justify-between">
                              <h1 className="text-lightgray font-bold mt-2">
                                New Password
                              </h1>
                            </div>
                            <Field
                              name="password"
                              type={passwordShown ? "text" : "password"}
                              className="bg-white border-b-2 border-lightgraycustom text-lightgraycustom font-semibold mb-4 outline-none focus:outline-none w-full px-2 py-1"
                            />
                            <i
                              className="absolute top-8 right-3 cursor-pointer"
                              onClick={togglePasswordVisibility}
                            >
                              {passwordShown ? <EyeHide /> : <Eye />}
                            </i>
                          </div>
                          {touched.newPassword && errors.newPassword && (
                            <div className="text-red-500 text-sm -mt-4 mb-3">
                              {errors.newPassword}
                            </div>
                          )}
                          <h1 className="text-lightgray font-bold mt-2">
                            Confirm New Password
                          </h1>

                          <Field
                            name="confirmNewPassword"
                            type="password"
                            className="bg-white border-b-2 border-lightgraycustom text-lightgraycustom font-semibold mb-4 outline-none focus:outline-none w-full px-2 py-1"
                          />
                          {touched.confirmNewPassword &&
                            errors.confirmNewPassword && (
                              <div className="text-red-500 text-sm -mt-4 mb-3">
                                {errors.confirmNewPassword}
                              </div>
                            )}

                          <div className="grid grid-cols-2 gap-6 mt-8">
                            <button
                              onClick={onClose}
                              className="bg-white border-2 border-statusRed text-statusRed font-bold outline-none focus:outline-none hover:opacity-80 py-2 rounded"
                            >
                              CANCEL
                            </button>

                            <button
                              type="submit"
                              disabled={
                                Object.keys(errors).length > 0 || loading
                              }
                              className={`${
                                Object.keys(errors).length > 0 || loading
                                  ? "border-lightgray text-lightgray"
                                  : "border-primaryGreen-200 text-primaryGreen-200"
                              } bg-white border-2 focus:outline-none hover:opacity-80 font-bold py-2 ml-2 rounded`}
                            >
                              {loading ? "Please wait..." : "SAVE"}
                            </button>
                          </div>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </FloatingCard>
              </div>
            </Fade>
          </div>
        </div>
      )}
    </>
  );
};
export default ChangePasswordModal;
