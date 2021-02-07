import React, { forwardRef, useState, useImperativeHandle } from "react";
import Fade from "react-reveal/Fade";
import { GrFormClose } from "react-icons/gr";

const AddModal = forwardRef(function AddModal(props, ref): JSX.Element {
  const [display, setDisplay] = useState<boolean>(false);

  useImperativeHandle(ref, () => {
    return {
      openAddModal: () => open(),
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
        <div className="fixed top-0 right-0 bottom-0 left-0">
          <div className="fixed top-0 bottom-0 left-0 right-0 z-0 bg-backdrop">
            <Fade bottom duration={500}>
              <div className="fixed bottom-0 p-8 md:left-1/3 w-full md:w-1/3 bg-white rounded-t-lg shadow-2xl">
                <a onClick={close} className="float-right cursor-pointer">
                  <GrFormClose size={24} />
                </a>
                <h1 className="text-lightblue font-extrabold text-3xl text-center">
                  Add New Link
                </h1>
                <input
                  type="text"
                  className="gradientInput mb-4 mt-10 outline-none focus:outline-none block appearance-none w-full bg-lightgray px-2 py-2"
                  placeholder="Title"
                />
                <input
                  type="text"
                  className="gradientInput mb-4 outline-none focus:outline-none block appearance-none w-full bg-lightgray px-2 py-2"
                  placeholder="URL"
                />
                <div className="flex items-center justify-center">
                  <button className="bg-lightblue focus:outline-none hover:bg-opacity-90 text-darkgray w-2/3 text-md shadow-lg font-extrabold py-3 px-4 my-2 rounded">
                    Add Link
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
export default AddModal;
