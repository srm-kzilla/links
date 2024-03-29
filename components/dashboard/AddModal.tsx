import React, { useEffect, useState } from "react";
import Fade from "react-reveal/Fade";
import { GrFormClose } from "react-icons/gr";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";

import { addLinkValidationSchema } from "../../utils/schema";

interface AddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLink: (link: {}, closeModal: () => void) => void;
}

const AddModal = ({
  isOpen,
  onClose,
  onAddLink,
}: AddModalProps): JSX.Element => {
  type FormData = Partial<Yup.InferType<typeof addLinkValidationSchema>>;

  const initialValues: FormData = {};

  const [isSubmittingLink, setIsSubmittingLink] = useState<boolean>(false);

  useEffect(() => {
    setIsSubmittingLink(false);
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <div
          className="fixed flex top-0 bottom-0 left-0 right-0 z-50 bg-backdrop items-center justify-center"
          onClick={onClose}
        >
          <div className="flex w-full items-center justify-evenly">
            <Fade bottom duration={200}>
              <div
                className="p-8 w-full md:w-1/3 bg-white rounded-lg shadow-2xl max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                <a onClick={onClose} className="float-right cursor-pointer">
                  <GrFormClose size={24} />
                </a>
                <h1 className="text-primaryGreen-300 font-extrabold text-3xl text-center">
                  Add New Link
                </h1>
                <Formik
                  initialValues={initialValues}
                  onSubmit={(values: FormData) => {
                    onAddLink(values, onClose);
                    setIsSubmittingLink(true);
                  }}
                  validateOnBlur={false}
                  validationSchema={addLinkValidationSchema}
                >
                  {({ errors, touched }) => (
                    <Form>
                      <h1 className="text-lightgray font-bold mb-1 mt-5">
                        Title
                      </h1>
                      <Field
                        name="title"
                        type="text"
                        className="border-b-2 border-lightgraycustom mb-4 outline-none focus:outline-none block appearance-none w-full bg-white px-2 py-2"
                        placeholder="Facebook"
                        autoFocus
                      />
                      {touched.title && errors.title && (
                        <div className="text-red-500 text-sm -mt-4 mb-3">
                          {errors.title}
                        </div>
                      )}

                      <h1 className="text-lightgray font-bold mb-1 mt-5">
                        URL
                      </h1>
                      <Field
                        name="url"
                        type="text"
                        className="border-b-2 border-lightgraycustom mb-4 outline-none focus:outline-none block appearance-none w-full bg-white px-2 py-2"
                        placeholder="https://facebook.com"
                      />
                      {touched.url && errors.url && (
                        <div className="text-red-500 text-sm -mt-4 mb-3">
                          {errors.url}
                        </div>
                      )}
                      <div className="flex items-center justify-center relative">
                        <button
                          type="submit"
                          disabled={
                            isSubmittingLink
                          }
                          className={`${
                            isSubmittingLink
                              ? "border-lightgray text-lightgray"
                              : "border-primaryGreen-200 text-primaryGreen-200"
                          } bg-white border-2 focus:outline-none hover:opacity-80 w-2/3 text-md font-bold py-3 px-4 my-2 rounded`}
                        >
                          {isSubmittingLink ? "Please wait..." : "ADD LINK"}
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </Fade>
          </div>
        </div>
      )}
    </>
  );
};
export default AddModal;
