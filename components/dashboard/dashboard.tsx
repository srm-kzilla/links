import React, { useContext, useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { parseCookies } from "nookies";
import { HiSearch } from "react-icons/hi";

import { AddLink, NoLinks } from "../../assets/icons";
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

const activeLinkInitialValues = {
  _id: "",
  title: "",
  url: "",
  image: "",
  status: false,
  views: 0,
  clicks: 0,
  analyticsCode: "",
  shortCode: "",
  createdAt: 0,
};

interface DashboardProps {
  _resLinks: Link[];
  totalViews: number;
}

export default function DashboardComponent({
  _resLinks,
  totalViews,
}: DashboardProps) {
  const { activeLink, setActiveLink } = useContext(SidebarContext);
  const [links, setLinks] = useState<Link[]>(_resLinks);
  const [searchLinkResults, setSearchLinkResults] = useState<Link[]>(_resLinks);
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
      });
    }
    setSearchLinkResults(searchResults);
  }, [searchLink]);

  const onAddLinkHandler = async (
    values: { title: string; url: string },
    closeModal: () => void
  ) => {
    const { authToken } = parseCookies();
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
          createdAt: res.data.createdAt,
        });
        return prevState;
      });

    closeModal();
  };

  const onDeleteLinkHandler = async (_id: string, closeModal: () => void) => {
    const { authToken } = parseCookies();
    const res = await deleteLink(authToken, _id);
    if (res) {
      setLinks((prevState) => [
        ...prevState.filter((item) => item._id !== _id),
      ]);
      closeModal();
      setActiveLink(activeLinkInitialValues);
    }
  };

  return (
    <>
      {links.length > 0 ? (
        <>
          <div className="relative min-h-screen flex flex-col py-24 bg-backgroundwhite">
            <div
              onClick={() => setActiveLink(activeLinkInitialValues)}
              className="absolute hidden lg:block w-full h-full bg-backgroundwhite top-0 bottom-0"
            ></div>
            <div className="fixed z-50 w-12 h-12 bottom-9 lg:top-24 right-4 xl:left-addButton focus:outline-none hover:opacity-70">
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="focus:outline-none"
                title="Add New Link"
              >
                <AddLink />
              </button>
            </div>

            <div className="flex items-center justify-center w-full">
              <h2 className="w-full sm:w-10/12 block lg:hidden px-5 my-2 font-black text-lg text-buttongray">
                <div className="flex flex-row">
                  <div className="flex items-center px-3 bg-white text-lightgraycustom rounded-l-md">
                    <HiSearch />
                  </div>
                  <input
                    type="text"
                    onChange={(e) => setSearchLink(e.target.value)}
                    placeholder="Search for a link..."
                    className="py-3 rounded-r-md outline-none focus:outline-none w-full"
                  />
                </div>
              </h2>
            </div>

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
            ) : searchLink !== "" ? (
              <h1 className="text-xl w-full sm:w-4/5 text-center mt-3">
                No links found!
              </h1>
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
            className="fixed md:fixed bottom-14 right-8 md:top-20 md:right-8 focus:outline-none w-20 h-20 rounded-full px-4 hover:opacity-70"
          >
            <AddLink />
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
