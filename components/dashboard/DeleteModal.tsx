import React, { forwardRef, useState, useImperativeHandle } from "react";
import Fade from "react-reveal/Fade";
import { GrFormClose } from "react-icons/gr";

const DeleteModal = forwardRef(function DeleteModal(props, ref): JSX.Element {
  const [display, setDisplay] = useState<boolean>(false);

  useImperativeHandle(ref, () => {
    return {
      openDeleteModal: () => open(),
      close: () => close(),
    };
  });
  const open = () => {
    setDisplay(true);
  };
  const close = () => {
    setDisplay(false);
  };
  if (display) {
    return (
      <>
        <div className="fixed z-50 top-0 right-0 bottom-0 left-0">
          <div className="fixed top-0 bottom-0 left-0 right-0 z-0 bg-backdrop">
            <Fade bottom duration={500}>
              <div className="fixed bottom-0 p-8 md:left-1/3 w-full md:w-1/3 bg-white rounded-t-lg shadow-2xl">
                <a onClick={close} className="float-right cursor-pointer">
                  <GrFormClose size={24} />
                </a>
                <h1 className="text-statusRed font-extrabold text-3xl text-center">
                  Confirm Delete
                </h1>
                <p className="text-center">Are you sure you want to delete the link?</p>
                <div className="flex items-center justify-center">
                  <button className="bg-statusRed focus:outline-none hover:bg-opacity-90 text-darkgray w-2/3 text-md shadow-lg font-extrabold py-3 px-4 mr-2 mt-7 rounded">
                    Delete
                  </button>
                  <button className="bg-lightblue focus:outline-none hover:bg-opacity-90 text-darkgray w-2/3 text-md shadow-lg font-extrabold py-3 px-4 mt-7 rounded">
                    Cancel
                  </button>
                </div>
              </div>
            </Fade>
          </div>
        </div>
      </>
    );
  }
  return null;
});
export default DeleteModal;