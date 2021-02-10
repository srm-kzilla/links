import React, { useContext } from "react";
import { FaChevronRight } from "react-icons/fa";
import Slide from "react-reveal/Slide";

import { Tick } from "../../assets/icons";
import Toggle from "./Toggle";
import { SidebarContext } from "../../utils/sidebarContext";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  links: number;
  clicks: number;
}

const Sidebar = ({
  isOpen,
  onClose,
  links,
  clicks,
}: SidebarProps): JSX.Element => {
  const { activeLink, setActiveLink } = useContext(SidebarContext);

  return (
    <>
      {isOpen && (
        <Slide right>
          <div className="fixed z-40 w-full md:w-custom p-2 h-screen top-14 right-0 rounded-l-lg shadow-custom bg-white">
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
                {clicks}
              </div>
            </div>
            {activeLink.title ? (
              <div>
                <div className="mt-12 ml-10">
                  <Toggle status={activeLink.status} />
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
                    onChange={(e) =>
                      setActiveLink({ ...activeLink, title: e.target.value })
                    }
                  ></input>
                  <button
                    className="cursor-pointer absolute right-2 bg-white -top-1"
                    type="submit"
                    onClick={() => console.log("post", activeLink)}
                  >
                    <Tick />
                  </button>
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
                    onChange={(e) =>
                      setActiveLink({ ...activeLink, url: e.target.value })
                    }
                  />
                  <button
                    className="cursor-pointer absolute right-2 bg-white -top-1"
                    type="submit"
                    onClick={() => console.log("post", activeLink)}
                  >
                    <Tick />
                  </button>
                </form>

                <p className="mt-6 text-darkgray font-extrabold">SHORT URL</p>
                <input
                  type="text"
                  name="link-short-url"
                  autoComplete="off"
                  className="gradientInputBottom focus:outline-none w-full"
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
                    {activeLink.views}
                  </div>
                  <div className="customGradient mt-2 text-3xl font-bold text-center">
                    {activeLink.clicks}
                  </div>
                </div>
              </div>
            ) : (
              <div>Click on a link</div>
            )}
          </div>
        </Slide>
      )}
    </>
  );
};

export default Sidebar;
