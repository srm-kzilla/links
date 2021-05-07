import React from "react";
import Fade from "react-reveal/Fade";
import { GrFormClose } from "react-icons/gr";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  linkId: string;
  onDeleteLink: (_id: string, closeModal: () => void) => void;
}

const DeleteModal = ({
  isOpen,
  onClose,
  linkId,
  onDeleteLink,
}: DeleteModalProps): JSX.Element => {
  const deleteHandler = (_id: string) => {
    onDeleteLink(_id, onClose);
  };

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
                <h1 className="text-statusRed font-extrabold text-3xl text-center">
                  Confirm Delete
                </h1>
                <p className="text-center">
                  Are you sure you want to delete the link?
                </p>
                <div className="flex items-center justify-center">
                  <button
                    onClick={onClose}
                    className="bg-lightblue focus:outline-none hover:bg-opacity-90 text-darkgray w-2/3 text-md shadow-lg font-extrabold mr-2 py-3 px-4 mt-7 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => deleteHandler(linkId)}
                    className="bg-statusRed focus:outline-none hover:bg-opacity-90 text-darkgray w-2/3 text-md shadow-lg font-extrabold py-3 px-4 mt-7 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </Fade>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteModal;
