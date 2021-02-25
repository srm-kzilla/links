import React, { forwardRef, useImperativeHandle } from "react";
import { useState } from "react";
import { FaChevronRight } from "react-icons/fa";
import Slide from "react-reveal/Slide";
import Toggle from "./Toggle";
// import { setServers } from "dns";

const Sidebar = forwardRef(function Sidebar(props, ref): JSX.Element {
  const [display, setDisplay] = useState<boolean>(false);

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
  if (display) {
    return (
      <>
        <Slide right>
          <div className="fixed w-full md:w-custom p-2 h-full top-14 right-0 rounded-l-lg shadow-custom bg-white">
            <a onClick={close} className="float-right mt-6 cursor-pointer">
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
            <div className="mt-12 grid grid-cols-2">
              <p className="text-center">Enable link?</p>
              <Toggle />
            </div>
            <p className="mt-10 text-darkgray font-extrabold">TITLE</p>
            <input
              type="text"
              autoComplete="off"
              className="gradientInputBottom focus:outline-none w-full"
              placeholder="Facebook"
            ></input>
            <p className="mt-6 text-darkgray font-extrabold">URL</p>
            <input
              type="text"
              autoComplete="off"
              placeholder="https://facebook.com/kzilla"
              className="gradientInputBottom focus:outline-none w-full"
            ></input>
            <p className="mt-6 text-darkgray font-extrabold">SHORT URL</p>
            <input
              type="text"
              autoComplete="off"
              className="gradientInputBottom focus:outline-none w-full"
              placeholder="https://kzilla.xyz/abcd"
            ></input>
            <div className="grid grid-cols-2 mt-5">
              <div className="text-center text-lg text-buttongray font-extrabold">
                VIEWS
              </div>
              <div className="text-center text-lg text-buttongray font-extrabold">
                CLICKS
              </div>
              <div className="customGradient mt-2 text-3xl font-bold text-center">
                234
              </div>
              <div className="customGradient mt-2 text-3xl font-bold text-center">
                123
              </div>
            </div>
          </div>
        </Slide>
      </>
    );
  }
  return null;
});
export default Sidebar;
