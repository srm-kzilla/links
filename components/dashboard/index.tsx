import React, { useContext, useState, useEffect } from "react";
import { VscAdd } from "react-icons/vsc";
import { IconContext } from "react-icons";

import { dataLink } from "../../utils/linksData";
import { NoLinks } from "../../assets/icons";
import { SidebarContext } from "../../utils/sidebarContext";

import Card from "./Card";
import AddModal from "./AddModal";
import Sidebar from "./Sidebar";

export default function DashboardComponent(): JSX.Element {
  const { setActiveLink } = useContext(SidebarContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (window.innerWidth <= 768) setIsSidebarOpen(false);
  }, []);

  return (
    <>
      {dataLink.length > 0 ? (
        <>
          <div className="mt-24 pb-10">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-backgroundwhite z-50 fixed border-dashed border-4 border-buttongray bottom-14 right-8 lg:top-20 lg:left-addButton focus:outline-none w-20 h-20 shadow-2xl rounded-full px-4 hover:opacity-70"
            >
              <IconContext.Provider value={{ color: "#4F4F4F", size: "42px" }}>
                <VscAdd />
              </IconContext.Provider>
            </button>

            <AddModal
              isOpen={isAddModalOpen}
              onClose={() => setIsAddModalOpen(false)}
            />

            {dataLink.map((link) => (
              <Card
                key={link.title.trim()}
                onCardClick={() => {
                  setActiveLink(link);
                  setIsSidebarOpen(true);
                }}
                link={link}
              />
            ))}
          </div>
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            links={dataLink.length}
            clicks={73}
          />
        </>
      ) : (
        <>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-backgroundwhite fixed md:fixed border-dashed border-4 border-buttongray bottom-14 right-8 md:top-20 md:right-96 focus:outline-none w-20 h-20 shadow-2xl rounded-full px-4 hover:opacity-70"
          >
            <IconContext.Provider value={{ color: "#4F4F4F", size: "42px" }}>
              <VscAdd />
            </IconContext.Provider>
          </button>

          <AddModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
          />

          <div className="flex w-screen h-screen">
            <div className="m-auto w-full">
              <NoLinks className="w-3/4 sm:w-1/2 md:w-1/3 m-auto" />
              <p className="w-full text-center mt-8 text-sm">
                Looks like you don't have any links, add a new link!
              </p>
            </div>
          </div>
        </>
      )}
    </>
  );
}
