import React, { MutableRefObject, useState } from "react";
import Logo from "./Logo";
import DeleteModal from "./DeleteModal";
import Sidebar from "./Sidebar";
import Spike from "../../shared/components/vectors/spike";
import Trash from "../../shared/components/vectors/trash";
import Pencil from "../../shared/components/vectors/pencil";
import Location from "../../shared/components/vectors/location";

export default function Card({ data, setActiveHandler }): JSX.Element {
  // console.log(setActiveHandler)
  const { urlName, url, status, image } = data;
  const modalRef = React.useRef() as MutableRefObject<HTMLDivElement>;
  const sidebarRef = React.useRef() as MutableRefObject<HTMLDivElement>;

  // const openSidebar = () => {
  //   sidebarRef.current.openSidebar();
  // }
  const showWhatLink = () => {
    setActiveHandler(data);
    // sidebarRef.current.openSidebar();
  };

  const openDeleteModal = () => {
    modalRef.current.openDeleteModal();
  };
  return (
    <>
      <div className="bg-white h-28 px-0 pt-0 my-6 mx-3 md:mx-20 shadow-custom rounded-xl w-auto md:w-3/5">
        <div className="float-left">
          <Logo status={status} image={image} />
        </div>
        <a
          onClick={openDeleteModal}
          className="ml-4 md:ml-6 mr-3 cursor-pointer mt-12 float-right"
        >
          <Trash />
        </a>
        <a
          onClick={showWhatLink}
          className="ml-4 md:ml-6 cursor-pointer mt-12 float-right"
        >
          <Spike />
        </a>
        <a
          onClick={showWhatLink}
          className="ml-4 md:ml-6 cursor-pointer mt-12 float-right"
        >
          <Pencil />
        </a>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-4 md:ml-6 cursor-pointer mt-12 float-right"
        >
          <Location />
        </a>
        <h2 className="text-2xl md:text-3xl font-bold pt-10 md:pt-7">
          {urlName}
        </h2>
        <a className="hidden md:inline-block">{url}</a>
        <DeleteModal ref={modalRef} />
      </div>
    </>
  );
}
