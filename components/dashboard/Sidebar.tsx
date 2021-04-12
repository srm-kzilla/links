import React, { useContext, useEffect, useRef, useState } from "react";
import { parseCookies } from "nookies";
import { FaChevronRight } from "react-icons/fa";
import Slide from "react-reveal/Slide";

import { Tick, Loading } from "../../assets/icons";
import { Toggle } from "./";
import { SidebarContext } from "../../utils/sidebarContext";
import { updateLink } from "../../utils/api";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  links: number;
  clicks: number;
}

const Sidebar = ({ isOpen, onClose, links, clicks }: SidebarProps): any => {
  const { activeLink, setActiveLink } = useContext(SidebarContext);

  const [title, setTitle] = useState<string>();
  const [linkUrl, setLinkUrl] = useState<string>();
  const [titleLoading, setTitleLoading] = useState<boolean>(false);
  const [linkLoading, setLinkLoading] = useState<boolean>(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (title) {
      if (title.length > 0) {
        setTitleLoading(true);
        intervalRef.current = setTimeout(() => {
          const { authToken } = parseCookies();
          const values = {
            title: title,
          };
          const res = updateLink(authToken, activeLink._id, values);
          if (res) {
            setTitleLoading(false);
          }
        }, 1000);
      }
    } else {
      clearTimeout(intervalRef.current);
    }
    return () => clearTimeout(intervalRef.current);
  }, [title]);

  useEffect(() => {
    if (linkUrl) {
      if (linkUrl.length > 0) {
        setLinkLoading(true);
        intervalRef.current = setTimeout(() => {
          const { authToken } = parseCookies();
          const values = {
            url: linkUrl,
          };
          const res = updateLink(authToken, activeLink._id, values);
          if (res) {
            setLinkLoading(false);
          }
        }, 1000);
      }
    }
    else {
      clearTimeout(intervalRef.current);
    }
    return () => clearTimeout(intervalRef.current);
  }, [linkUrl]);

  return (
    <>
      {isOpen && (
        <Slide right>
          <div className="fixed z-40 w-full lg:w-custom p-2 h-screen top-14 right-0 rounded-l-lg shadow-custom bg-white">
            <button
              onClick={onClose}
              className="relative md:hidden float-right mt-6 cursor-pointer"
            >
              <FaChevronRight size={20} />
            </button>
            <h1 className="pl-3 mt-5 font-bold text-xl text-statusRed">
              TOTAL STATISTICS
            </h1>
            <div className="grid grid-cols-2 mt-8">
              <div className="text-center text-xl text-buttongray font-extrabold">
                LINKS
              </div>
              <div className="text-center text-xl text-buttongray font-extrabold">
                CLICKS
              </div>
              <div className="customGradient mt-2 text-5xl font-bold text-center">
                {links}
              </div>
              <div className="customGradient mt-2 text-5xl font-bold text-center">
                {/* {clicks} */}
                N.A.
              </div>
            </div>
            {activeLink.title ? (
              <div>
                <div className="mt-12 ml-10">
                  <Toggle status={activeLink.status} linkId={activeLink._id} />
                </div>
                <p className="mt-10 text-darkgray font-extrabold">TITLE</p>
                <form
                  className="relative"
                  onSubmit={(e: React.FormEvent) => e.preventDefault()}
                >
                  <input
                    type="text"
                    name="link-title"
                    autoComplete="off"
                    className="gradientInputBottom focus:outline-none w-full"
                    placeholder="SRMKZILLA"
                    value={activeLink.title}
                    onChange={(e) => {
                      setActiveLink({ ...activeLink, title: e.target.value });
                      setTitle(e.target.value);
                    }}
                  />
                  <div className="absolute right-2 bg-white -top-1">
                    {titleLoading ? <Loading /> : <Tick />}
                  </div>
                </form>

                <p className="mt-6 text-darkgray font-extrabold">URL</p>
                <form
                  className="relative"
                  onSubmit={(e: React.FormEvent) => e.preventDefault()}
                >
                  <input
                    type="text"
                    name="link-url"
                    autoComplete="off"
                    className="gradientInputBottom focus:outline-none w-full"
                    placeholder="https://facebook.com/kzilla"
                    value={activeLink.url}
                    onChange={(e) => {
                      setActiveLink({ ...activeLink, url: e.target.value });
                      setLinkUrl(e.target.value);
                    }}
                  />
                  <div className="absolute right-2 bg-white -top-1">
                    {linkLoading ? <Loading /> : <Tick />}
                  </div>
                </form>

                <p className="mt-6 text-darkgray font-extrabold">SHORT URL</p>
                <input
                  type="text"
                  name="link-short-url"
                  autoComplete="off"
                  className="gradientInputBottom cursor-not-allowed focus:outline-none w-full"
                  placeholder="https://kzilla.xyz/abcd"
                  disabled
                />

                <div className="grid grid-cols-2 mt-5">
                  <div className="text-center text-lg text-buttongray font-extrabold">
                    VIEWS
                  </div>
                  <div className="text-center text-lg text-buttongray font-extrabold">
                    CLICKS
                  </div>
                  <div className="customGradient mt-2 text-3xl font-bold text-center">
                    {/* {activeLink.views} */}
                    N.A.
                  </div>
                  <div className="customGradient mt-2 text-3xl font-bold text-center">
                    {/* {activeLink.clicks} */}
                    N.A.
                  </div>
                </div>
                <div className="flex items-center justify-center mt-2">
                  <button
                    type="submit"
                    className="bg-lightblue focus:outline-none hover:bg-opacity-90 text-darkgray w-2/3 text-md shadow-lg font-extrabold py-3 px-4 my-2 rounded">
                    GIVE ME MORE
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <p>Click on a link</p>
              </div>
            )}
          </div>
        </Slide>
      )}
    </>
  );
};

export default Sidebar;
