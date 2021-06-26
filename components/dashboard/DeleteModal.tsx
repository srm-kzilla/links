import React, { useEffect, useState } from "react";
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
    setIsDeletingLink(true);
  };

  const [isDeletingLink, setIsDeletingLink] = useState<boolean>(false);

  useEffect(() => {
    setIsDeletingLink(false);
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <div className="fixed z-50 top-0 right-0 bottom-0 left-0">
          <div className="fixed top-0 bottom-0 left-0 right-0 z-0 bg-backdrop">
            <div className="flex h-screen">
              <div className="flex w-full items-center justify-evenly">
                <Fade bottom duration={200}>
                  <div className="p-8 w-full md:w-1/3 bg-white rounded-lg shadow-2xl max-w-md">
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
                        className="bg-white border-2 border-primaryGreen-200 focus:outline-none hover:opacity-80 text-primaryGreen-200 w-2/3 text-md font-bold mr-2 py-3 px-4 mt-7 rounded"
                      >
                        CANCEL
                      </button>
                      <button
                        onClick={() => deleteHandler(linkId)}
                        disabled={isDeletingLink}
                        className={`${
                          isDeletingLink
                            ? "border-lightgray text-lightgray"
                            : "border-statusRed text-statusRed"
                        } bg-white border-2 focus:outline-none hover:opacity-80 w-2/3 text-md font-bold py-3 px-4 mt-7 rounded`}
                      >
                        {isDeletingLink ? "Please wait..." : "DELETE"}
                      </button>
                    </div>
                  </div>
                </Fade>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteModal;
