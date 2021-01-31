import { useState } from "react";
import Flip from "react-reveal/Flip";
import { FaChevronDown } from "react-icons/fa";

export default function Navbar() {
  const [isOpen, setisOpen] = useState(false);
  function handleMenuClick() {
    setisOpen(!isOpen);
  }
  return (
    <div>
      <nav className="bg-white shadow-xl rounded-bl-xl">
        <div>
          <div className="grid grid-cols-2">
            <a className="text-black text-2xl font-bold p-3 text-left">LOGO</a>

            <div className="grid grid-cols-1 justify-self-end">
              <div className="hidden sm:inline-block">
                <img
                  className="w-12 h-12 rounded-full ml-3 mt-1 mb-2 float-left"
                  src="https://yt3.ggpht.com/ytc/AAUvwnjBxDbxCCpVNyEEKREl0qhQcIJ8DNaJkpv57LDsCMs=s900-c-k-c0x00ffffff-no-rj"
                />
                <div
                  className="mr-4 pl-4 cursor-pointer select-none float-right my-4 hover:text-gray-500"
                  onClick={handleMenuClick}
                >
                  John Doe
                  <div className="float-right pt-1 ml-2">
                    <FaChevronDown />
                  </div>
                </div>
              </div>
              <button
                className="inline-block sm:hidden mr-5"
                onClick={handleMenuClick}
              >
                <img src="https://img.icons8.com/android/24/000000/menu.png" />
              </button>
            </div>
          </div>
        </div>
      </nav>
      <Flip right>
        <div
          className="block md:absolute right-0 bg-white shadow-xl rounded-b-xl md:w-1/6 text-center"
          style={{ display: isOpen ? "block" : "none" }}
        >
          <a
            href="/"
            className="py-2 rounded hover:bg-lightblue text-sm font-normal block"
          >
            Home
          </a>
          <a
            href="/login"
            className="py-2 rounded hover:bg-lightblue text-sm font-normal block"
          >
            Login / Sign Up
          </a>
          <a
            href="/"
            className="py-2 rounded hover:bg-lightblue text-sm font-normal block"
          >
            About Us
          </a>
          <a
            href="/"
            className="py-2 rounded hover:bg-lightblue text-sm font-normal block"
          >
            How to Use?
          </a>
          <a
            href="/"
            className="py-2 rounded hover:bg-lightblue text-sm font-normal block"
          >
            Contact Us
          </a>
        </div>
      </Flip>
    </div>
  );
}
