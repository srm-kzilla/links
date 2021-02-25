import React, { MutableRefObject } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { HiOutlinePencil } from "react-icons/hi";
import { BsGraphUp } from "react-icons/bs";
import { GrLocation } from "react-icons/gr";
import data from "../../shared/constants/data";
import Logo from "./Logo";
import DeleteModal from "./DeleteModal";
import Sidebar from "./Sidebar";

export default function Card({data}): JSX.Element {
  const { urlName, url, status, image } = data;
  const modalRef = React.useRef() as MutableRefObject<HTMLDivElement>;
  const sidebarRef = React.useRef() as MutableRefObject<HTMLDivElement>;
  
  const openDeleteModal = () => {
    modalRef.current.openDeleteModal();
  };
  const openSidebar = () => {
    sidebarRef.current.openSidebar();
  }
  return (
    <>
      <div className="bg-white h-28 px-0 pt-0 my-6 mx-3 md:mx-20 shadow-custom rounded-xl w-auto md:w-3/5">
        <div className="float-left"> 
            <Logo status={status} image={image}/>
        </div>  
        <a onClick={openDeleteModal} className="ml-4 md:ml-6 mr-3 cursor-pointer mt-12 float-right"><AiOutlineDelete size={24}/></a>
        <a onClick={openSidebar} className="ml-4 md:ml-6 cursor-pointer mt-12 float-right"><BsGraphUp size={24}/></a>
        <a onClick={openSidebar} className="ml-4 md:ml-6 cursor-pointer mt-12 float-right"><HiOutlinePencil size={24}/></a>
        <a href={url} target="_blank" rel="noopener noreferrer" className="ml-4 md:ml-6 cursor-pointer mt-12 float-right"><GrLocation size={24}/></a>
        <h2 className="text-2xl md:text-3xl font-bold pt-10 md:pt-7">{urlName}</h2>
        <a className="hidden md:inline-block">
          {url}
        </a>
        <DeleteModal ref={modalRef} />
        <Sidebar ref={sidebarRef} />
      </div>
    </>
  );    
}
