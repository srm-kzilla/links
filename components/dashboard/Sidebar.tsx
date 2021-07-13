import React, { useContext, useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { parseCookies } from "nookies";
import { MdContentCopy } from "react-icons/md";
import { HiSearch } from "react-icons/hi";
import Slide from "react-reveal/Slide";
import Fade from "react-reveal/Fade";
import ReactTooltip from "react-tooltip";
import * as Yup from "yup";

import { Tick, Loading, EditPencil, Info } from "../../assets/icons";
import { Toggle } from "./";
import { SidebarContext } from "../../store/sidebarContext";
import { searchDashboardLink } from "../../utils/store";

import {
  errorHandler,
  successHandler,
  updateLink,
  getLinkClicks,
  getLinkStats,
} from "../../utils/api";
import { time_ago, truncateText } from "../../utils/functions";
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
  const [validUrl, setValidUrl] = useState<boolean>(true);
  const [conversionRate, setConversionRate] = useState<string>("");
  const [cityLabel, setCityLabel] = useState<string>("");
  const [cityValue, setCityValue] = useState<string>("");

  const [_, setSearchLink] = useRecoilState(searchDashboardLink);

  const intervalRef = useRef(null);

  // INFO: To copy URL to clipboard
  const copyToClipBoard = async (copyMe: string) => {
    try {
      await navigator.clipboard.writeText(copyMe);
      successHandler("📋 Link copied to clipboard!");
    } catch (err) {
      errorHandler(err);
    }
  };

  // INFO: Remove onHover effect for edit, copy icon for small screens
  useEffect(() => {
    if (window.innerWidth <= 768) {
      setShowTitleEdit(true);
      setShowUrlEdit(true);
    }
  }, []);

  // INFO: Debouncing title update
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

  // INFO: Debouncing URL update
  useEffect(() => {
    if (linkUrl) {
      if (linkUrl.length > 0) {
        setLinkLoading(true);

        setValidUrl(Yup.string().url().isValidSync(linkUrl));

        intervalRef.current = setTimeout(() => {
          const { authToken } = parseCookies();
          const values = {
            url: linkUrl,
          };
          if (validUrl) {
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

  // INFO: Clicks per link API fetch only when _id changes
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
  }, [activeLink._id]);

  // INFO: Conversion rate, city name and value API call when _id changes
  useEffect(() => {
    const { authToken } = parseCookies();
    if (activeLink._id) {
      (async () => {
        setConversionRate("");
        setCityValue("");
        const _res = await getLinkStats(authToken, activeLink._id);
        if (_res.maxValue != "NIL") {
          setCityLabel(_res.maxValue.label);
          setCityValue(_res.maxValue.value);
        } else {
          setCityLabel("");
          setCityValue("");
        }
        setConversionRate(_res.conversionRate);
      })();
    }
  }, [activeLink._id]);

  return (
    <>
      {isOpen && (
        <Slide right>
          <div className="fixed overflow-auto z-40 w-full lg:w-custom p-2 h-screen top-14 right-0 rounded-l-lg shadow-custom bg-white min-w-max xl:max-w-lg">
            <h1 className="pl-5 mt-5 font-sans font-black text-2xl text-buttongray">
              Total Statistics
            </h1>

            {activeLink.shortCode && (
              <>
                <div
                  onMouseEnter={() => setShowTitleEdit(true)}
                  onMouseLeave={() => setShowTitleEdit(false)}
                  className="flex flex-row mt-4 mx-5 p-4"
                >
                  <div className="flex items-center justify-center w-12 h-12 overflow-hidden rounded-md">
                    <img
                      className="w-auto max-h-full rounded-md"
                      src={activeLink.image}
                      alt={activeLink.title}
                    />
                  </div>
                  <div
                    className={`flex flex-col ${
                      showTitleInput ? "w-full" : ""
                    }`}
                  >
                    {!showTitleInput && (
                      <h1 className="relative text-xl text-lightgray font-bold mx-2">
                        {activeLink.title
                          ? truncateText(activeLink.title, 15, 12)
                          : "untitled"}
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
                      <form
                        className="relative"
                        onSubmit={(e: React.FormEvent) => e.preventDefault()}
                      >
                        <input
                          type="text"
                          name="link-title"
                          autoComplete="off"
                          className="border-b-2 border-lightgraycustom focus:outline-none w-full ml-2"
                          placeholder="SRMKZILLA"
                          maxLength={30}
                          value={activeLink.title}
                          onBlur={() => setShowTitleInput(false)}
                          onKeyPress={(e) => {
                            e.key == "Enter" && setShowTitleInput(false);
                          }}
                          onChange={(e) => {
                            setActiveLink({
                              ...activeLink,
                              title: e.target.value,
                            });
                            setTitle(e.target.value);
                          }}
                        />
                        <div className="absolute -right-2 bg-white -top-1 pb-1 pl-2">
                          {titleLoading ? (
                            <Loading />
                          ) : (
                            <button
                              className="focus:outline-none"
                              onClick={() => setShowTitleInput(false)}
                            >
                              <Tick />
                            </button>
                          )}
                        </div>
                      </form>
                    )}

                    <p className="customGradient text-xs font-bold mx-2">
                      Created {time_ago(activeLink.createdAt)}
                    </p>
                  </div>
                </div>
              </>
            )}

            {!activeLink.shortCode && (
              <>
                <h2 className="pl-5 mt-5 font-bold text-lg text-buttongray">
                  NO LINK SELECTED
                </h2>
                <h2 className="px-5 mt-5 font-black text-lg text-buttongray">
                  <div className="flex flex-row">
                    <div className="pt-1 pr-1 text-lightgraycustom border-b-2 border-lightgraycustom">
                      <HiSearch />
                    </div>
                    <input
                      type="text"
                      onChange={(e) => setSearchLink(e.target.value)}
                      placeholder="Search for a link..."
                      className="border-b-2 border-lightgraycustom focus:outline-none w-full"
                    />
                  </div>
                </h2>
              </>
            )}

            {!activeLink._id && (
              <div className="grid grid-cols-2 mt-8 mx-5">
                <div className="rounded-md text-lg text-buttongray bg-offwhite font-bold m-1 p-1">
                  <p className="pl-2">Total Links</p>
                  <div className="customGradient p-2">
                    <p className="text-3xl">{links || "N.A"}</p>
                  </div>
                </div>

                <div className="rounded-md text-lg text-buttongray bg-offwhite font-bold m-1 p-1">
                  <p className="pl-2">Total Views</p>
                  <div className="customGradient p-2">
                    <p className="text-3xl">{totalViews || "N.A"}</p>
                  </div>
                </div>
              </div>
            )}

            {conversionRate != "NIL" && cityLabel != "" && activeLink._id && (
              <Fade>
                <div
                  className={`grid grid-cols-2 mt-4 mx-5 ${
                    !activeLink.status && "filter grayscale"
                  }`}
                >
                  <div className="flex flex-col justify-evenly rounded-md text-lg text-buttongray bg-offwhite font-bold m-1 p-1">
                    <h4 className="pl-2">Conversion</h4>
                    <p className="customGradient px-2 text-3xl">
                      {conversionRate ? (
                        `${conversionRate}%`
                      ) : (
                        <div className="p-2">
                          <Loading />
                        </div>
                      )}
                    </p>
                    <p className="flex flex-row-reverse">
                      <span
                        className="flex cursor-pointer w-4"
                        data-tip="Percentage of total clicks over links for a link"
                      >
                        <Info />
                      </span>
                    </p>
                    <ReactTooltip
                      effect="solid"
                      place="bottom"
                      backgroundColor="black"
                      clickable={true}
                    />
                  </div>

                  <div className="flex flex-col justify-evenly rounded-md text-lg text-buttongray bg-offwhite font-bold m-1 p-1">
                    <p className="pl-2 overflow-hidden">
                      {truncateText(cityLabel, 12, 8) || "City"}
                    </p>
                    <div className="customGradient">
                      <p className="text-3xl px-2">
                        {cityValue ? (
                          cityValue
                        ) : (
                          <div className="p-2">
                            <Loading />
                          </div>
                        )}
                      </p>
                    </div>
                    <p className="flex flex-row-reverse">
                      <span
                        className="flex cursor-pointer w-4"
                        data-tip="City with the highest number of clicks"
                      >
                        <Info />
                      </span>
                    </p>
                    <ReactTooltip
                      effect="solid"
                      place="bottom"
                      backgroundColor="black"
                      clickable={true}
                    />
                  </div>
                </div>
              </Fade>
            )}

            {activeLink.shortCode && (
              <>
                <div
                  className={`grid grid-cols-2 mx-5 ${
                    !activeLink.status && "filter grayscale"
                  }`}
                >
                  <div className="flex flex-col justify-evenly rounded-md text-xl text-buttongray bg-offwhite font-bold m-1 p-1">
                    <p className="pl-2">Views</p>
                    <div className="customGradient px-2">
                      <p className="text-3xl">{activeLink.views || "N.A"}</p>
                    </div>
                    <p className="flex flex-row-reverse">
                      <span
                        className="flex cursor-pointer w-4"
                        data-tip="Total number of views for this link"
                      >
                        <Info />
                      </span>
                    </p>
                    <ReactTooltip
                      effect="solid"
                      place="bottom"
                      backgroundColor="black"
                      clickable={true}
                    />
                  </div>

                  <div className="flex flex-col justify-evenly rounded-md text-xl text-buttongray bg-offwhite font-bold m-1 p-1">
                    <p className="pl-2">Clicks</p>
                    <div className="customGradient">
                      <div className="px-2 text-3xl">
                        {clicksLoading ? (
                          <div className="p-2">
                            <Loading />
                          </div>
                        ) : (
                          activeLinkClicks
                        )}
                      </div>
                    </div>
                    <p className="flex flex-row-reverse">
                      <span
                        className="flex cursor-pointer w-4"
                        data-tip="Total number of clicks for this link"
                      >
                        <Info />
                      </span>
                    </p>
                    <ReactTooltip
                      effect="solid"
                      place="bottom"
                      backgroundColor="black"
                      clickable={true}
                    />
                  </div>
                </div>
              </>
            )}

            {activeLink.shortCode ? (
              <>
                <div
                  onMouseEnter={() => setShowUrlEdit(true)}
                  onMouseLeave={() => setShowUrlEdit(false)}
                >
                  <div className="grid grid-cols-2 mt-4 mx-5">
                    <div>
                      <p className="text-lg font-bold text-darkgray pl-2">
                        ENABLE URL
                      </p>
                    </div>

                    <div className="ml-12 -mt-2 text-right pr-11">
                      <Toggle
                        status={activeLink.status}
                        linkId={activeLink._id}
                      />
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
                              <Fade duration={200}>
                                <span className="absolute -bottom-11 right-1">
                                  <EditPencil />
                                </span>
                              </Fade>
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
                          href={activeLink.url}
                        >
                          <p className="text-lightgraycustom flex-initial">
                            {activeLink.url
                              ? truncateText(activeLink.url, 30, 23)
                              : "No URL specified"}
                          </p>
                        </a>
                      )}
                      {showUrlInput && (
                        <>
                          <form
                            className="relative"
                            onSubmit={(e: React.FormEvent) =>
                              e.preventDefault()
                            }
                          >
                            <input
                              type="text"
                              name="link-url"
                              autoComplete="off"
                              className="border-b-2 border-lightgraycustom focus:outline-none w-full"
                              placeholder="https://facebook.com/kzilla"
                              value={activeLink.url}
                              onKeyPress={(e) => {
                                e.key == "Enter" && setShowUrlInput(false);
                              }}
                              onBlur={() => setShowUrlInput(false)}
                              onChange={(e) => {
                                setActiveLink({
                                  ...activeLink,
                                  url: e.target.value,
                                });
                                setLinkUrl(e.target.value);
                              }}
                            />

                            <div className="absolute right-0 bg-white top-0 pb-2 pl-2">
                              {linkLoading ? (
                                <Loading />
                              ) : (
                                <button
                                  className="focus:outline-none"
                                  onClick={() => setShowUrlInput(false)}
                                >
                                  <Tick />
                                </button>
                              )}
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
                    <h1 className="font-bold font-sans customGradient text-lg">
                      SHORT URL
                    </h1>

                    <div className="flex">
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href={`${kzillaxyzdomain}${activeLink.shortCode}`}
                      >
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
                        <Fade duration={200}>
                          <i className="float-right -mt-5 grid-cols-1 cursor-pointer text-lightgraycustom">
                            <MdContentCopy />
                          </i>
                        </Fade>
                      </button>
                    )}
                  </div>
                </div>

                <div className="w-full mb-8 lg:mb-0 lg:absolute lg:bottom-12">
                  <div className="flex items-center justify-center">
                    <div className="grid grid-cols-1">
                      <a
                        className="text-center"
                        href={`https://kzilla.xyz/analytics/${activeLink.analyticsCode}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <button className="bg-white border-2 border-primaryGreen-300 text-lg md:text-sm focus:outline-none hover:opacity-80 w-full font-extrabold py-3 px-4 my-4 rounded-md">
                          <p className="text-primaryGreen-300">
                            SHOW MORE ANALYTICS
                          </p>
                        </button>
                      </a>

                      <button
                        onClick={onClose}
                        className="bg-white border-2 border-statusRed text-lg md:text-sm focus:outline-none hover:opacity-80 w-full font-extrabold py-3 px-4 rounded-md block lg:hidden mb-16"
                      >
                        <p className="text-statusRed">CLOSE</p>
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="mx-6 mt-5">
                <p className="customGradient font-sans text-xl font-bold">
                  CLICK ON A LINK
                </p>
                <p className="text-buttongray">Click on a link to show stats</p>
              </div>
            )}
          </div>
        </Slide>
      )}
    </>
  );
};

export default Sidebar;
