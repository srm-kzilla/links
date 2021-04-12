import { useState } from "react";
import { useRouter } from 'next/router'
import Flip from "react-reveal/Flip";
import { FaChevronDown } from "react-icons/fa";

import { Logo } from "../../assets/icons"
import { altNavbarRoutes } from "../../utils/constants";

export default function Navbar() {
  const router = useRouter()
  const [isOpen, setisOpen] = useState<boolean>(false);
  return (
    <nav className="fixed top-0 z-50 w-full bg-white shadow-custom rounded-bl-xl">
      <div>
        <div className="grid grid-cols-2">
          <a href="/" className="text-black text-2xl font-bold p-3 text-left">
            <div className="float-left mr-2"><Logo /></div>
            <div className="ml-2 pt-1">LINKS</div>
          </a>

          {!altNavbarRoutes.includes(router.route) && <div className="grid grid-cols-1 justify-self-end">
            <div className="hidden sm:inline-block">
              <img
                className="w-12 h-12 rounded-full ml-3 mt-2 mb-2 float-left border"
                src="https://bestbody.com.au/wp-content/uploads/2019/11/placeholder-person.png"
              />
              <div
                className="mr-4 pl-4 cursor-pointer select-none float-right my-4 hover:text-gray-500"
                onClick={() => setisOpen(!isOpen)}
              >
                John Doe
                <div className="float-right pt-1 ml-2">
                  <FaChevronDown />
                </div>
              </div>
            </div>
            <button
              className="inline-block sm:hidden mr-5"
              onClick={() => setisOpen(!isOpen)}
            >
              <img src="https://img.icons8.com/android/24/000000/menu.png" />
            </button>
          </div>}
        </div>
      </div>
      {isOpen && (
        <Flip right>
          <div className="relative md:absolute right-0 bg-white shadow-xl rounded-b-xl md:w-1/6 text-center">
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
              href="/profile"
              className="py-2 rounded hover:bg-lightblue text-sm font-normal block"
            >
              Edit Profile
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
              Log Out
            </a>
          </div>
        </Flip>
      )}
    </nav>
  );
}
