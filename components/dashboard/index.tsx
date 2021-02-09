import React, { MutableRefObject, useState } from "react";
import { VscAdd } from "react-icons/vsc";
import Card from "./Card";
import data from "../../shared/constants/data";
import { IconContext } from "react-icons";
import AddModal from "./AddModal";
import Sidebar from "./Sidebar";
import Nolinks from "../../shared/components/vectors/nolinks";

export default function DashboardComponent(): JSX.Element {
  const modalRef = React.useRef();
  const sidebarRef = React.useRef() as MutableRefObject<HTMLDivElement>;
  const [activeLinkData, setactiveLinkData] = useState();

  let numberOfLinks = data.length;

  const openAddModal = () => {
    modalRef.current.openAddModal();
  };
  // const openSidebar = () => {
  //   sidebarRef.current.openSidebar();
  // }
  if (numberOfLinks > 1) {
    return (
      <>
        <div className="mt-24 pb-10">
          <button
            onClick={openAddModal}
            className="bg-backgroundwhite fixed md:fixed border-dashed border-4 border-buttongray bottom-14 right-8 md:top-20 md:right-96 focus:outline-none w-20 h-20 shadow-2xl rounded-full px-4 hover:opacity-70"
          >
            <IconContext.Provider value={{ color: "#4F4F4F", size: "42px" }}>
              <VscAdd />
            </IconContext.Provider>
          </button>
          <AddModal ref={modalRef}></AddModal>
          {data.map((linksData) => (
            <Card
              key={linksData.urlName.trim()}
              data={linksData}
              setActiveHandler={setactiveLinkData}
            />
          ))}
        </div>
        {/* <Sidebar activeLink={data} /> */}
        <Sidebar activeLink={activeLinkData} />
      </>
    );
  }
  return (
    <>
      <button
        onClick={openAddModal}
        className="bg-backgroundwhite fixed md:fixed border-dashed border-4 border-buttongray bottom-14 right-8 md:top-20 md:right-96 focus:outline-none w-20 h-20 shadow-2xl rounded-full px-4 hover:opacity-70"
      >
        <IconContext.Provider value={{ color: "#4F4F4F", size: "42px" }}>
          <VscAdd />
        </IconContext.Provider>
      </button>
      <AddModal ref={modalRef}></AddModal>
      <div className="mt-24 mx-auto w-auto lg:w-1/3 h-1/4">
        <Nolinks />
      </div>
      <div className="text-center mt-2 text-sm">Looks like you don't have any links, add a new link!</div>
    </>
  );
}
