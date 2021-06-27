import React, { useContext, useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { parseCookies } from "nookies";

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
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  const [searchLink] = useRecoilState(searchDashboardLink);

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

    if (searchLink !== "") {
      links.map((item) => {
        if (item.title.toLowerCase().includes(searchLink.toLowerCase())) {
          searchResults.push(item);
        }
      });
      if (!searchResults.length) setLinks(_resLinks);
      else setLinks(searchResults);
      return;
    }
    setLinks(_resLinks);
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
            createdAt: res.data.createdAt,
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
          <div className="min-h-screen flex flex-col py-24 bg-backgroundwhite">
            {/* <button
              onClick={() => setIsAddModalOpen(true)}
              className="z-50 fixed bottom-7 right-4 lg:top-20 lg:left-addButton focus:outline-none w-16 sm:w-20 h-16 sm:h-20 rounded-full px-2 sm:px-4 hover:opacity-70"
              title="Add New Link"
            >
              <AddLink />
            </button> */}
            <div className="fixed md:absolute z-50 bottom-7 lg:top-20 right-4 xl:left-addButton focus:outline-none hover:opacity-70">
              <button
                onClick={() => setIsAddModalOpen(true)}
                className=""
                title="Add New Link"
              >
                <AddLink />
              </button>
            </div>

            <AddModal
              isOpen={isAddModalOpen}
              onClose={() => setIsAddModalOpen(false)}
              onAddLink={onAddLinkHandler}
            />

            {links.map((link) => (
              <Card
                key={link._id}
                onCardClick={() => {
                  setLinks(_resLinks);
                  setActiveLink(link);
                  setIsSidebarOpen(true);
                }}
                link={link}
                onDeleteCard={onDeleteLinkHandler}
              />
            ))}
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
