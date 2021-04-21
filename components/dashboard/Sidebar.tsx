import React, { useContext, useEffect, useRef, useState } from "react";
import { parseCookies } from "nookies";
import { FaChevronRight } from "react-icons/fa";
import { MdContentCopy } from "react-icons/md";
import Slide from "react-reveal/Slide";

import { Tick, Loading } from "../../assets/icons";
import { Toggle } from "./";
import { SidebarContext } from "../../utils/sidebarContext";
import { errorHandler, successHandler, updateLink, getLinkClicks } from "../../utils/api";
import { time_ago } from "../../utils/functions";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  links: number;
  totalViews: number;
}

const Sidebar = ({ isOpen, onClose, links, totalViews }: SidebarProps): any => {
  const { activeLink, setActiveLink } = useContext(SidebarContext);

  const [title, setTitle] = useState<string>();
  const [linkUrl, setLinkUrl] = useState<string>();
  const [titleLoading, setTitleLoading] = useState<boolean>(false);
  const [linkLoading, setLinkLoading] = useState<boolean>(false);
  const [clicksLoading, setClicksLoading] = useState<boolean>(false);
  const [activeLinkClicks, setActiveLinkClicks] = useState<number>(0);
  const intervalRef = useRef(null);

  const copyToClipBoard = async copyMe => {
    try {
      await navigator.clipboard.writeText(copyMe);
      successHandler("📋 Link copied to clipboard!");
    } catch (err) {
      errorHandler(err);
    }
  };

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

  useEffect(() => {
    setClicksLoading(true);
    if(activeLink.title){
      (async () => {
        const _res = await getLinkClicks(activeLink.analyticsCode);
        setActiveLinkClicks(_res);
        if(_res >= 0 ) {
          setClicksLoading(false);
        }
      })();
    }
  },[activeLink])

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
                VIEWS
              </div>
              <div className="customGradient mt-2 text-5xl font-bold text-center">
                {links}
              </div>
              <div className="customGradient mt-2 text-5xl font-bold text-center">
                {totalViews}
              </div>
            </div>
            {activeLink.title ? (
              <div>
                <p className="text-center mt-2">Created {time_ago(activeLink.createdAt)}</p>
                <div className="mt-4 ml-10">
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
                <div className="flex">
                  <input
                    type="text"
                    name="link-short-url"
                    autoComplete="off"
                    className="gradientInputBottom cursor-text focus:outline-none w-full"
                    placeholder="https://kzilla.xyz/abcd"
                    value={`https://kzilla.xyz/${activeLink.shortCode}`}
                    disabled
                  />
                  <button onClick={() => copyToClipBoard(`https://kzilla.xyz/${activeLink.shortCode}`)} className="float-right focus:outline-none" title="Copy to Clipboard">
                    <i className="float-right mt-1 mx-3 grid-cols-1 cursor-pointer"><MdContentCopy /></i>
                  </button>
                </div>
                <div className="grid grid-cols-2 mt-5">
                  <div className="text-center text-lg text-buttongray font-extrabold">
                    VIEWS
                  </div>
                  <div className="text-center text-lg text-buttongray font-extrabold">
                    CLICKS
                  </div>
                  <div className="customGradient mt-2 text-3xl font-bold text-center">
                    {activeLink.views}
                  </div>
                  <div className="customGradient mt-2 text-3xl font-bold text-center flex items-center justify-center">
                    {clicksLoading ? <Loading /> : activeLinkClicks}
                  </div>
                </div>
                <div className="flex items-center justify-center mt-2">
                  <a
                    className="text-center text-sm"
                    href={`https://kzilla.xyz/analytics/${activeLink.analyticsCode}`}
                    target="_blank"
                    rel="noopener noreferrer">
                    <button
                      className="bg-lightblue focus:outline-none hover:bg-opacity-90 text-darkgray w-4/5 shadow-lg font-extrabold py-3 px-4 my-2 rounded">
                      SHOW DETAILED ANALYTICS
                    </button>
                  </a>
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
