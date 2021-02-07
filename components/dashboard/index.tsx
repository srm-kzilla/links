import React, { MutableRefObject } from "react";
import { VscAdd } from "react-icons/vsc";
import Card from "./card";
import data from "../../shared/constants/data";
import { IconContext } from "react-icons";
import AddModal from "./AddModal";
import Sidebar from "./Sidebar";

export default function DashboardComponent(): JSX.Element {
  const modalRef = React.useRef() as MutableRefObject<HTMLDivElement>;

  const openAddModal = () => {
    modalRef.current.openAddModal();
  };
  return (
    <>
      <div className="mt-24">
        <button
          onClick={openAddModal}
          className="bg-backgroundwhite fixed md:absolute border-dashed border-4 border-buttongray bottom-14 right-8 md:top-20 md:right-96 focus:outline-none w-20 h-20 shadow-2xl rounded-full px-4 hover:opacity-70"
        >
          <IconContext.Provider value={{ color: "#4F4F4F", size: "42px" }}>
            <VscAdd />
          </IconContext.Provider>
        </button>
        <AddModal ref={modalRef}></AddModal>
        {data.map((linksData, index) => (
          <Card key={index} data={linksData} />
        ))}
      </div>
      {/* <Sidebar ref={modalRef} /> */}
    </>
  );
}
