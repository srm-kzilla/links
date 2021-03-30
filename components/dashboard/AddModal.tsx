import React from "react";
import Fade from "react-reveal/Fade";
import { GrFormClose } from "react-icons/gr";
import { parseCookies } from "nookies";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";

import { Link } from "./dashboard";

interface AddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLink: (
    link: { title: string; url: string },
    resetForm: () => void,
    closeModal: () => void
  ) => void;
}

const AddModal = ({
  isOpen,
  onClose,
  onAddLink,
}: AddModalProps): JSX.Element => {
  const initialValues = {
    title: "",
    url: "",
  };

  const validationSchema = Yup.object({
    title: Yup.string().trim().required("This is a required field"),
    url: Yup.string()
      .trim()
      .matches(
        /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
        "Enter correct url!"
      )
      .required("This is a required field"),
  });

  return (
    <>
      {isOpen && (
        <div className="fixed z-50 top-0 right-0 bottom-0 left-0">
          <div className="fixed top-0 bottom-0 left-0 right-0 z-0 bg-backdrop">
            <Fade bottom duration={500}>
              <div className="fixed bottom-0 p-8 md:left-1/3 w-full md:w-1/3 bg-white rounded-t-lg shadow-2xl">
                <a onClick={onClose} className="float-right cursor-pointer">
                  <GrFormClose size={24} />
                </a>
                <h1 className="text-lightblue font-extrabold text-3xl text-center">
                  Add New Link
                </h1>
                <Formik
                  initialValues={initialValues}
                  onSubmit={(values, { resetForm }) =>
                    onAddLink(values, resetForm, onClose)
                  }
                  validationSchema={validationSchema}
                >
                  {({ errors }) => (
                    <Form>
                      <Field
                        name="title"
                        type="text"
                        className="gradientInput mb-4 mt-10 outline-none focus:outline-none block appearance-none w-full bg-lightgray px-2 py-2"
                        placeholder="Title"
                        autoFocus
                      />
                      {errors.title && (
                        <div className="text-red-500 text-sm -mt-4 mb-3">
                          {errors.title}
                        </div>
                      )}
                      <Field
                        name="url"
                        type="text"
                        className="gradientInput mb-4 outline-none focus:outline-none block appearance-none w-full bg-lightgray px-2 py-2"
                        placeholder="URL"
                      />
                      {errors.url && (
                        <div className="text-red-500 text-sm -mt-4 mb-3">
                          {errors.url}
                        </div>
                      )}
                      <div className="flex items-center justify-center">
                        <button
                          type="submit"
                          className="bg-lightblue focus:outline-none hover:bg-opacity-90 text-darkgray w-2/3 text-md shadow-lg font-extrabold py-3 px-4 my-2 rounded"
                        >
                          Add Link
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
