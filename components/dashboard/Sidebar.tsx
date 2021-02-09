import React, {
  forwardRef,
  useImperativeHandle,
  useEffect,
  useState,
} from "react";
import { FaChevronRight } from "react-icons/fa";
import Slide from "react-reveal/Slide";
import Tick from "../../shared/components/vectors/tick";
import Toggle from "./Toggle";

// Sidebar component will take a prop called activeLink ( all data )
// const Sidebar = ({activeLink} : Link): JSX.Element {

const Sidebar = forwardRef(function Sidebar({ activeLink, isOpen=false }, ref): JSX.Element {
  const [display, setDisplay] = useState<boolean>(true);
  const [linkTitle, setLinkTitle] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  useEffect(() => {
    console.log("Active", activeLink);
  }, [activeLink]);

  useImperativeHandle(ref, () => {
    return {
      openSidebar: () => open(),
      close: () => close(),
    };
  });

  const open = () => {
    setDisplay(true);
  };
  const close = () => {
    setDisplay(false);
  };
  const titleText = () => {
    console.log(linkTitle);
  };
  const linkText = () => {
    console.log(linkUrl);
  };
  if (display) {
    return (
      <>
        <Slide right>
          <div className="fixed z-40 w-full md:w-custom p-2 h-screen top-14 right-0 rounded-l-lg shadow-custom bg-white">
            <a onClick={close} className="relative md:hidden float-right mt-6 cursor-pointer">
              <FaChevronRight size={20} />
            </a>
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
                9
              </div>
              <div className="customGradient mt-2 text-5xl font-bold text-center">
                200
              </div>
            </div>
            {activeLink ? (
              <div>
                <div className="mt-12 ml-10">
                  <Toggle />
                </div>
                <p className="mt-10 text-darkgray font-extrabold">TITLE</p>
                <div className="relative">
                  <input
                    type="text"
                    autoComplete="off"
                    className="gradientInputBottom focus:outline-none w-full"
                    placeholder="Facebook"
                    onChange={(e) => setLinkTitle(e.target.value)}
                  ></input>
                  <a
                    className="cursor-pointer absolute right-2 bg-white -top-1"
                    onClick={titleText}
                  >
                    <Tick />
                  </a>
                </div>
                <p className="mt-6 text-darkgray font-extrabold">URL</p>
                <div className="relative">
                  <a
                    className="cursor-pointer absolute right-2 bg-white -top-1"
                    onClick={linkText}
                  >
                    <Tick />
                  </a>
                  <input
                    type="text"
                    autoComplete="off"
                    placeholder="https://facebook.com/kzilla"
                    className="gradientInputBottom focus:outline-none w-full"
                    onChange={(e) => setLinkUrl(e.target.value)}
                  ></input>
                </div>
                <p className="mt-6 text-darkgray font-extrabold">SHORT URL</p>
                <input
                  type="text"
                  autoComplete="off"
                  className="gradientInputBottom focus:outline-none w-full"
                  placeholder="https://kzilla.xyz/abcd"
                  disabled
                ></input>
                <div className="grid grid-cols-2 mt-5">
                  <div className="text-center text-lg text-buttongray font-extrabold">
                    VIEWS
                  </div>
                  <div className="text-center text-lg text-buttongray font-extrabold">
                    CLICKS
                  </div>
                  <div className="customGradient mt-2 text-3xl font-bold text-center">
                    {activeLink?.views || "N/A"}
                  </div>
                  <div className="customGradient mt-2 text-3xl font-bold text-center">
                    {activeLink?.clicks || "N/A"}
                  </div>
                </div>
              </div>
            ) : (
              <div>Click on a link</div>
            )}
          </div>
        </Slide>
      </>
    );
  }
  return null;
});
export default Sidebar;
