import { useContext, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import Link from "next/link";
import { FaChevronDown } from "react-icons/fa";
import { useRouter } from "next/router";
import { parseCookies, destroyCookie } from "nookies";

import { AuthContext } from "../../store/authContext";
import { getUserProfile } from "../../utils/api";
import { ImageContext } from "../../store/profileImageContext";
import { truncateText } from "../../utils/functions";
import { SrmKzillaLogo, Loading } from "../../assets/icons";
import { dropdownMenu } from "../../utils/constants";
import { userProfileName } from "../../utils/store";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [profileName, _] = useRecoilState(userProfileName);
  const { isAuth } = useContext(AuthContext);
  const { fileBlob } = useContext(ImageContext);
  const router = useRouter();

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
    name: "",
    username: "",
    profilePicture: "newUser.png",
  });

  const logoutUser = () => {
    destroyCookie(null, "authToken");
    localStorage.removeItem("isAuth");
    window.location.replace("/");
  };

  return (
    router.pathname !== "/" && (
      <>
        <nav className={`fixed top-0 z-50 w-full bg-white rounded-bl-xl`}>
          <div className="grid grid-cols-2">
            <Link href="/">
              <a className="text-black text-2xl font-bold p-3 text-left">
                <div className="float-left mx-3">
                  <img width="45" height="45" src="linkslogo.png" alt="links" />
                </div>
                <div className="ml-2 pt-1 text-base md:text-xl text-lightgray">
                  LINKS
                </div>
              </a>
            </Link>

            {isAuth ? (
              <>
                <div className="grid grid-cols-1 justify-self-end">
                  <div className="hidden sm:inline-block">
                    <div
                      className="flex items-center mr-4 pl-4 cursor-pointer select-none float-left my-1 text-lightgray hover:text-lightgraycustom"
                      onClick={() => setIsOpen(!isOpen)}
                    >
                      {userProfileData.username && !profileName
                        ? truncateText(
                            userProfileData.name || userProfileData.username,
                            20,
                            15
                          )
                        : !profileName && <Loading />}

                      {profileName && userProfileData.username
                        ? truncateText(profileName, 20, 15)
                        : ""}
                      <div className="float-right pt-1 ml-2">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full overflow-hidden float-left mb-2 border">
                          <img
                            className="w-auto max-h-full border"
                            src={
                              fileBlob
                                ? fileBlob
                                : userProfileData.profilePicture
                            }
                            alt="profile-image"
                          />
                        </div>
                        <div className="flex items-center py-5 px-2">
                          <FaChevronDown />
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    className="inline-block sm:hidden mr-5 outline-none focus:outline-none"
                    onClick={() => setIsOpen(!isOpen)}
                  >
                    <img src="https://img.icons8.com/android/24/000000/menu.png" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-row justify-self-end my-auto text-center">
                  <div className="m-auto hover:opacity-80">
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href="https://srmkzilla.net"
                    >
                      <SrmKzillaLogo />
                    </a>
                  </div>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://srmkzilla.net"
                    className="text-xs sm:text-lg font-normal p-4 rounded text-lightgray hover:opacity-80"
                  >
                    About Us
                  </a>
                </div>
              </>
            )}
          </div>

          {isOpen && (
            <>
              <div className="relative z-50">
                {isAuth && (
                  <div className="relative md:absolute right-0 bg-white shadow-xl rounded-b-xl md:w-1/6 text-center text-buttongray">
                    {dropdownMenu.map((item) => {
                      return (
                        <Link key={item.href} href={item.href}>
                          <button
                            onClick={() => setIsOpen(false)}
                            className={`w-full py-2 rounded ${
                              router.pathname === `${item.href}` && "font-bold"
                            } hover:bg-lightblue text-sm font-normal block outline-none focus:outline-none`}
                          >
                            {item.name}
                          </button>
                        </Link>
                      );
                    })}

                    <Link href={`/${userProfileData.username}`}>
                      <a>
                        <button
                          onClick={() => setIsOpen(false)}
                          className={`w-full py-2 ${
                            router.asPath == `/${userProfileData.username}` &&
                            "font-bold"
                          } rounded hover:bg-lightblue text-sm font-normal block outline-none focus:outline-none`}
                        >
                          My Public Link Page
                        </button>
                      </a>
                    </Link>

                    <button
                      className="w-full py-2 rounded hover:bg-lightblue text-sm font-normal block outline-none focus:outline-none"
                      onClick={logoutUser}
                    >
                      Log Out
                    </button>
                  </div>
                )}
              </div>
              <div
                onClick={() => setIsOpen(false)}
                className="fixed top-0 bottom-0 right-0 left-0 bg-transparent z-10"
              />
            </>
          )}
        </nav>
      </>
    )
  );
}
