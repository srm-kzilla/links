import { useContext, useEffect, useState } from "react";
import Fade from 'react-reveal/Fade';
import { FaChevronDown } from "react-icons/fa";
import { useRouter } from "next/router";
import { parseCookies, destroyCookie } from "nookies";

import { AuthContext } from "../../store/authContext";
import { getUserProfile } from "../../utils/api";
import { ImageContext } from "../../store/profileImageContext";

export default function Navbar() {
  const { isAuth } = useContext(AuthContext);
  const { fileBlob } = useContext(ImageContext);
  useEffect(() => {
    if (isAuth) {
      (async () => {
        const { authToken } = parseCookies();
        const _res = await getUserProfile(authToken);
        if (_res) {
          setUserProfileData(_res.data);
        }
      })();
    }
  }, [isAuth, fileBlob]);


  const [userProfileData, setUserProfileData] = useState({
    name: "User",
    username: "User",
    profilePicture:
      "https://bestbody.com.au/wp-content/uploads/2019/11/placeholder-person.png",
  });
  const [isOpen, setisOpen] = useState<boolean>(false);
  const router = useRouter();

  const logoutUser = () => {
    destroyCookie(null, "authToken");
    router.replace("/");
    router.reload();
  };

  return (
    router.pathname != "/" && (
      <>
        <nav
          className={`fixed top-0 z-50 w-full bg-white shadow-custom rounded-bl-xl`}
        >
          <div className="grid grid-cols-2">
            <a href="/" className="text-black text-2xl font-bold p-3 text-left">
              <div className="float-left mx-3"><img width="45" height="45" src="linkslogo.png" alt="links" /></div>
              <div className="ml-2 pt-1">LINKS</div>
            </a>
            {isAuth ? (
              <>
                <div className="grid grid-cols-1 justify-self-end">
                  <div className="hidden sm:inline-block">
                    <div
                      className="flex items-center mr-4 pl-4 cursor-pointer select-none float-left my-1 hover:text-gray-500"
                      onClick={() => setisOpen(!isOpen)}
                    >
                      {userProfileData.name || userProfileData.username}
                      <div className="float-right pt-1 ml-2">
                        <img
                          className="flex items-center w-12 h-12 rounded-full float-left mb-2 border"
                          src={
                            fileBlob ? fileBlob : userProfileData.profilePicture
                          }
                        />
                        <div className="flex items-center py-5 px-2">
                          <FaChevronDown />
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    className="inline-block sm:hidden mr-5"
                    onClick={() => setisOpen(!isOpen)}
                  >
                    <img src="https://img.icons8.com/android/24/000000/menu.png" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-2 justify-self-end my-auto text-center">
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://srmkzilla.net"
                    className="py-2 text-xs sm:text-lg font-normal p-4 rounded hover-underline-animation"
                  >
                    About Us
                  </a>
                  <a
                    href={router.pathname == "/login" ? "/signup" : "/login"}
                    className="py-2 text-xs sm:text-lg font-normal p-4 rounded hover-underline-animation"
                  >
                    {router.pathname == "/login" ? "Signup" : "Login"}
                  </a>
                </div>
              </>
            )}
          </div>

          {isOpen && (
            <Fade top>
              <div className="relative md:absolute right-0 bg-white shadow-xl rounded-b-xl md:w-1/6 text-center">
                {isAuth && (
                  <a
                    href="/"
                    className={`py-2 rounded ${
                      router.pathname == "/" && "font-bold"
                    } hover:bg-lightblue text-sm font-normal block`}
                  >
                    Home
                  </a>
                )}
                {isAuth &&
                  <a
                    href="/dashboard"
                    className={`py-2 rounded ${router.pathname == "/dashboard" && "font-bold"} hover:bg-lightblue text-sm font-normal block`}
                  >
                    Dashboard
                  </a>
                }
                {isAuth &&
                  <a
                    href="/profile"
                    className={`py-2 rounded ${router.pathname == "/profile" && "font-bold"} hover:bg-lightblue text-sm font-normal block`}
                  >
                    Edit Profile
                  </a>
                }
                {isAuth &&
                  <a
                    className="py-2 rounded hover:bg-lightblue text-sm font-normal block cursor-pointer"
                    onClick={() => logoutUser()}
                  >
                    Log Out
                  </a>
                }
              </div>
            </Fade>
          )}
        </nav>
      </>
    )
  );
}
