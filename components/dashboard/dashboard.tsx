import React, { useContext, useState, useEffect } from "react";
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { VscAdd } from "react-icons/vsc";
import { IconContext } from "react-icons";
import { parseCookies } from "nookies";

import { NoLinks } from "../../assets/icons";
import { SidebarContext } from "../../utils/sidebarContext";
import { AddModal, Card, Sidebar } from "./";
import { getLinks, postLink } from "../../utils/api";

export interface Link {
  _id: string;
  title: string;
  url: string;
  image: string;
  status: boolean;
  views: number;
  clicks: number;
}

export default function DashboardComponent(): JSX.Element {
  const { setActiveLink } = useContext(SidebarContext);

  const [links, setLinks] = useState<Link[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (window.innerWidth <= 768) setIsSidebarOpen(false);
    const { authToken } = parseCookies();

    (async () => {
      const res = await getLinks(authToken);
      setLinks(res);
    })();
  }, []);

  // const getServerSideProps: GetServerSideProps = async() => {
  //   const { authToken } = parseCookies();
  //   const res = await fetch('http://localhost:3000/api/v1/links/get', {
  //     headers: {
  //       Authorization: `Bearer ${authToken}` 
  //     }
  //   })
  //   const data:Link[] = await res.json()
  //   console.log(data)
  //   setLinks(data);
  //   return {
  //     props: {
  //       data,
  //     },
  //   }
  // }
  // getServerSideProps();

  // (function Page({data}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  //   console.log(data)
 
  // });

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
            _id: res.data._id
          });
          return prevState;
        });
      resetForm();
      closeModal();
    })();
  };
  return (
    <>
      {links.length > 0 ? (
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
              onAddLink={onAddLinkHandler}
            />

            {links.map((link) => (
              <Card
                key={link._id}
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
            links={links.length}
            clicks={links[0].clicks}
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
            onAddLink={onAddLinkHandler}
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
