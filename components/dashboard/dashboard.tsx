import React, { useContext, useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { VscAdd } from "react-icons/vsc";
import { IconContext } from "react-icons";
import { parseCookies } from "nookies";

import { NoLinks } from "../../assets/icons";
import { SidebarContext } from "../../store/sidebarContext";
import { AddModal, Card, Sidebar } from "./";
import { postLink, deleteLink } from "../../utils/api";
import { searchDashboardLink } from "../../utils/store";

export interface Link {
  _id: string;
  title: string;
  url: string;
  image: string;
  status: boolean;
  views: number;
  clicks: number;
  analyticsCode: string;
  shortCode: string;
  createdAt: number;
}

interface DashboardProps {
  _resLinks: Link[];
  totalViews: number;
}

export default function DashboardComponent({ _resLinks, totalViews }: DashboardProps) {
  const { activeLink, setActiveLink } = useContext(SidebarContext);
  const [links, setLinks] = useState<Link[]>(_resLinks);
  const [searchLinkResults, setSearchLinkResults] = useState<Link[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  const [searchLink, setSearchLink] = useRecoilState(searchDashboardLink);

  useEffect(() => {
    if (window.innerWidth <= 768) setIsSidebarOpen(false);
  }, []);

  useEffect(() => {
    setLinks((_prevState) => [
      ..._prevState.map((item) => {
        if (item._id !== activeLink._id) return item;
        else return activeLink;
      }),
    ]);
  }, [activeLink]);

  useEffect(() => {
    let searchResults: Link[] = [];

    if (searchLink != "") {
      links.map((item) => {
        if (item.title.toLowerCase().includes(searchLink.toLowerCase())) {
          searchResults.push(item);
        }
      })
    }
    setSearchLinkResults(searchResults);
  }, [searchLink]);

  const onAddLinkHandler = (
    values: { title: string; url: string },
    resetForm: () => void,
    closeModal: () => void
  ) => {
    const { authToken } = parseCookies();
    (async () => {
      const res = await postLink(authToken, values);
      if (res)
        setLinks((prevState) => {
          prevState.push({
            ...values,
            clicks: 0,
            views: 0,
            status: true,
            image: res.data.image,
            _id: res.data._id,
            shortCode: res.data.shortCode,
            analyticsCode: res.data.analyticsCode,
            createdAt: res.data.createdAt
          });
          return prevState;
        });
      resetForm();
      closeModal();
    })();
  };

  const onDeleteLinkHandler = (_id: string, closeModal: () => void) => {
    const { authToken } = parseCookies();
    (async () => {
      const res = await deleteLink(authToken, _id);
      if (res) {
        setLinks((prevState) => [
          ...prevState.filter((item) => item._id !== _id),
        ]);
        closeModal();
      }
    })();
  };

  return (
    <>
      {links.length > 0 ? (
        <>
          <div className="mt-24 pb-10">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-backgroundwhite z-50 fixed border-dashed border-4 border-buttongray bottom-7 right-4 lg:top-20 lg:left-addButton focus:outline-none w-16 sm:w-20 h-16 sm:h-20 shadow-2xl rounded-full px-2 sm:px-4 hover:opacity-70"
              title="Add New Link">
              <IconContext.Provider value={{ color: "#4F4F4F", size: "42px" }}>
                <VscAdd />
              </IconContext.Provider>
            </button>

            <AddModal
              isOpen={isAddModalOpen}
              onClose={() => setIsAddModalOpen(false)}
              onAddLink={onAddLinkHandler}
            />

            {searchLinkResults.length > 0 ? (
              searchLinkResults.map((link) => (
                <Card
                  key={link._id}
                  onCardClick={() => {
                    setSearchLinkResults([]);
                    setActiveLink(link);
                    setIsSidebarOpen(true);
                  }}
                  link={link}
                  onDeleteCard={onDeleteLinkHandler}
                />
              ))
            ) : (
              links.map((link) => (
                <Card
                  key={link._id}
                  onCardClick={() => {
                    setActiveLink(link);
                    setIsSidebarOpen(true);
                  }}
                  link={link}
                  onDeleteCard={onDeleteLinkHandler}
                />
              ))
            )}
          </div>
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            links={links.length}
            totalViews={totalViews}
          />
        </>
      ) : (
        <>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-backgroundwhite fixed md:fixed border-dashed border-4 border-buttongray bottom-14 right-8 md:top-20 md:right-8 focus:outline-none w-20 h-20 shadow-2xl rounded-full px-4 hover:opacity-70"
          >
            <IconContext.Provider value={{ color: "#4F4F4F", size: "42px" }}>
              <VscAdd />
            </IconContext.Provider>
          </button>

          <AddModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onAddLink={onAddLinkHandler}
          />

          <div className="flex h-screen">
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
