import React, { useContext, useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { parseCookies } from "nookies";
import { FaChevronRight } from "react-icons/fa";
import { MdContentCopy } from "react-icons/md";
import Slide from "react-reveal/Slide";
import * as Yup from "yup";

import { Tick, Loading, EditPencil } from "../../assets/icons";
import { Toggle } from "./";
import { SidebarContext } from "../../store/sidebarContext";
import { searchDashboardLink } from "../../utils/store";

import {
  errorHandler,
  successHandler,
  updateLink,
  getLinkClicks,
} from "../../utils/api";
import { time_ago, truncateSidebarTitleText, truncateSidebarURLText } from "../../utils/functions";
import { kzillaxyzdomain } from "../../utils/constants";

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
  const [showTitleInput, setShowTitleInput] = useState<boolean>(false);
  const [showUrlInput, setShowUrlInput] = useState<boolean>(false);
  const [showTitleEdit, setShowTitleEdit] = useState<boolean>(false);
  const [showUrlEdit, setShowUrlEdit] = useState<boolean>(false);
  const [validUrl, setValidUrl] = useState(true);

  const [searchLink, setSearchLink] = useRecoilState(searchDashboardLink);

  const intervalRef = useRef(null);

  const copyToClipBoard = async (copyMe) => {
    try {
      await navigator.clipboard.writeText(copyMe);
      successHandler("📋 Link copied to clipboard!");
    } catch (err) {
      errorHandler(err);
    }
  };

  useEffect(() => {
    if (window.innerWidth <= 768) {
      setShowTitleEdit(true);
      setShowUrlEdit(true);
    }
  }, []);

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

        setValidUrl(
          Yup.string()
            .url()
            .isValidSync(linkUrl)
        );

        intervalRef.current = setTimeout(() => {
          const { authToken } = parseCookies();
          const values = {
            url: linkUrl,
          };
          if(validUrl) {
            const res = updateLink(authToken, activeLink._id, values);
            if (res) {
              setLinkLoading(false);
            }
          }
        }, 1000);
      }
    } else {
      clearTimeout(intervalRef.current);
    }
    return () => clearTimeout(intervalRef.current);
  }, [linkUrl]);

  useEffect(() => {
    setClicksLoading(true);
    if (activeLink.title.length >= 1) {
      (async () => {
        const _res = await getLinkClicks(activeLink.analyticsCode);
        setActiveLinkClicks(_res);
        if (_res >= 0) {
          setClicksLoading(false);
        }
      })();
    }
  }, [activeLink]);

  return (
    <>
      {isOpen && (
        <Slide right>
          <div className="fixed z-40 w-full lg:w-custom p-2 h-screen top-14 right-0 rounded-l-lg shadow-custom bg-white">
            <button
              onClick={onClose}
              className="relative lg:hidden float-right mt-6 cursor-pointer"
            >
              <FaChevronRight size={20} />
            </button>
            <h1 className="pl-5 mt-5 font-sans font-black text-2xl text-buttongray">
              TOTAL STATISTICS
            </h1>
            {activeLink.shortCode && (
              <>
                <div
                  onMouseEnter={() => setShowTitleEdit(true)}
                  onMouseLeave={() => setShowTitleEdit(false)}
                  className="flex flex-row mt-4 mx-5 p-4"
                >
                  <img width="45" height="45" className="rounded" src={activeLink.image} alt={activeLink.title} />
                  <div className="flex flex-col">
                    {!showTitleInput && (
                      <h1 className="relative text-xl text-lightgraycustom font-extrabold mx-2">
                        {truncateSidebarTitleText(activeLink.title)}
                        <button
                          onClick={() => setShowTitleInput(true)}
                          title="Edit Title"
                        >
                          {showTitleEdit && (
                            <div className="absolute -right-8 bottom-2">
                              <EditPencil />
                            </div>
                          )}
                        </button>
                      </h1>
                    )}
                    {showTitleInput && (
                      <>
                        <form
                          className="relative"
                          onSubmit={(e: React.FormEvent) => e.preventDefault()}
                        >
                          <input
                            type="text"
                            name="link-title"
                            autoComplete="off"
                            className="gradientInputBottom focus:outline-none w-full ml-2"
                            placeholder="SRMKZILLA"
                            maxLength={30}
                            value={activeLink.title}
                            onBlur={() => setShowTitleInput(false)}
                            onKeyPress={(e) => { e.key == "Enter" && setShowTitleInput(false) }}
                            onChange={(e) => {
                              setActiveLink({ ...activeLink, title: e.target.value });
                              console.log(activeLink.title);
                              setTitle(e.target.value);
                            }}
                          />
                          <div className="absolute -right-2 bg-white -top-1 pb-1 pl-2">
                            {titleLoading ? <Loading /> : <button
                              className="focus:outline-none"
                              onClick={() => setShowTitleInput(false)}>
                              <Tick />
                            </button>
                            }
                          </div>
                        </form>
                      </>
                    )}
                    <p className="customGradient text-xs font-bold mx-2">Created {time_ago(activeLink.createdAt)}</p>
                  </div>
                </div>
              </>
            )}
            {!activeLink.shortCode && (
              <>
                <h2 className="pl-5 mt-5 font-black text-lg text-buttongray">
                  NO LINK SELECTED
                </h2>
                <h2 className="px-5 mt-5 font-black text-lg text-buttongray">
                  <input
                    type="text"
                    onChange={(e) => setSearchLink(e.target.value)}
                    placeholder="Search for a link..."
                    className="gradientInputBottom focus:outline-none w-full"
                  />
                </h2>
              </>
            )}
            <div className={`grid grid-cols-2 mt-4 mx-5 ${!activeLink.status && "filter grayscale"}`}>
              <div className="rounded-md text-xl text-buttongray bg-offwhite font-extrabold m-1 p-1">
                <p className="pl-2">Total Links</p>
                <div className="customGradient p-2">
                  <p className="text-4xl">{links || "N.A"}</p>
                </div>
              </div>
              <div className="rounded-md text-xl text-buttongray bg-offwhite font-extrabold m-1 p-1">
                <p className="pl-2">Total Views</p>
                <div className="customGradient p-2">
                  <p className="text-4xl">{totalViews || "N.A"}</p>
                </div>
              </div>
            </div>
            {activeLink.shortCode && (
              <>
                <div className={`grid grid-cols-2 mx-5 ${!activeLink.status && "filter grayscale"}`}>
                  <div className="rounded-md text-xl text-buttongray bg-offwhite font-extrabold m-1 p-1">
                    <p className="pl-2">Views</p>
                    <div className="customGradient p-2">
                      <p className="text-4xl">{activeLink.views || "N.A"}</p>
                    </div>
                  </div>
                  <div className="rounded-md text-xl text-buttongray bg-offwhite font-extrabold m-1 p-1">
                    <p className="pl-2">Clicks</p>
                    <div className="customGradient p-2">
                      <p className="text-4xl">{clicksLoading ? <div className="mt-2"><Loading /></div> : activeLinkClicks}</p>
                    </div>
                  </div>
                </div>
              </>
            )}
            {activeLink.shortCode ? (
              <div
                onMouseEnter={() => setShowUrlEdit(true)}
                onMouseLeave={() => setShowUrlEdit(false)}
              >
                <div className="grid grid-cols-2 mt-4 mx-5">
                  <div>
                    <p className="text-lg font-bold text-darkgray pl-2">ENABLE URL</p>
                  </div>
                  <div className="ml-12 -mt-2">
                    <Toggle status={activeLink.status} linkId={activeLink._id} />
                  </div>
                </div>
                <div className="my-3 mx-6">
                  <h1 className="font-bold font-sans customGradient text-lg">
                    URL
                    {showUrlEdit && (
                      <>
                        {!showUrlInput && (
                          <button
                            className="float-right focus:outline-none relative"
                            title="Edit URL"
                            onClick={() => setShowUrlInput(true)}
                          >
                            <div className="absolute -bottom-11 right-1">
                              <EditPencil />
                            </div>
                          </button>
                        )}
                      </>
                    )}
                  </h1>
                  <div className={`${!showUrlInput && "flex"}`}>
                    {!showUrlInput && (
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href={activeLink.url}>
                        <p className="text-lightgraycustom flex-initial">
                          {truncateSidebarURLText(activeLink.url)}
                        </p>
                      </a>
                    )}
                    {showUrlInput && (
                      <>
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
                            onKeyPress={(e) => { e.key == "Enter" && setShowUrlInput(false) }}
                            onBlur={() => setShowUrlInput(false)}
                            onChange={(e) => {
                              setActiveLink({ ...activeLink, url: e.target.value });
                              setLinkUrl(e.target.value);
                            }}
                          />
                          <div className="absolute right-0 bg-white top-0 pb-2 pl-2">
                            {linkLoading ? <Loading /> : <button
                              className="focus:outline-none"
                              onClick={() => setShowUrlInput(false)}>
                              <Tick />
                            </button>
                            }
                          </div>
                          {!validUrl && (
                            <div className="text-red-500 mt-1 text-sm mb-3">
                              URL is not valid!
                            </div>
                          )}
                        </form>
                      </>
                    )}
                  </div>
                </div>
                <div className="my-3 mx-6">
                  <h1 className="font-bold font-sans customGradient text-lg">SHORT URL</h1>
                  <div className="flex">
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={`${kzillaxyzdomain}${activeLink.shortCode}`}>
                      <p className="text-lightgraycustom flex-initial">
                        {`${kzillaxyzdomain}${activeLink.shortCode}`}
                      </p>
                    </a>
                  </div>
                  {showUrlEdit && (
                    <button
                      onClick={() =>
                        copyToClipBoard(
                          `${kzillaxyzdomain}${activeLink.shortCode}`
                        )
                      }
                      className="float-right focus:outline-none"
                      title="Copy to Clipboard"
                    >
                      <i className="float-right -mt-5 grid-cols-1 cursor-pointer text-lightgraycustom">
                        <MdContentCopy />
                      </i>
                    </button>
                  )}
                </div>
                <div className="flex items-center justify-center mt-2">
                  <a
                    className="text-center text-sm"
                    href={`https://kzilla.xyz/analytics/${activeLink.analyticsCode}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <button className="bg-white border-2 border-customGreen focus:outline-none hover:opacity-80 w-full font-extrabold py-3 px-4 my-4 rounded-md">
                      <p className="text-customGreen">SHOW MORE ANALYTICS</p>
                    </button>
                  </a>
                </div>
              </div>
            ) : (
              <div className="mx-6 mt-5">
                <p className="customGradient font-sans text-xl font-bold ">
                  CLICK ON A LINK
                </p>
                <p>Click on a link to show stats</p>
              </div>
            )}
          </div>
        </Slide>
      )}
    </>
  );
};

export default Sidebar;
