import { useContext, useEffect, useState } from "react";
import Flip from "react-reveal/Flip";
import { FaChevronDown } from "react-icons/fa";
import { useRouter } from "next/router";
import { parseCookies, destroyCookie } from "nookies";

import { Logo } from "../../assets/icons"
import { AuthContext } from "../../utils/authContext";
import { getUserProfile } from "../../utils/api";
import { ImageContext } from "../../utils/profileImageContext";

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
    profilePicture: "https://bestbody.com.au/wp-content/uploads/2019/11/placeholder-person.png"
  });
  const [isOpen, setisOpen] = useState<boolean>(false);
  const router = useRouter()
  const logoutUser = () => {
    destroyCookie(null, "authToken");
    router.replace('/');
    router.reload();
  }

  return (
    <nav className="fixed top-0 z-50 w-full bg-white shadow-custom rounded-bl-xl">
      <div className="grid grid-cols-2">
        <a href="/" className="text-black text-2xl font-bold p-3 text-left">
          <div className="float-left mr-2"><Logo /></div>
          <div className="ml-2 pt-1">LINKS</div>
        </a>
        {isAuth ? (
          <>
            <div className="grid grid-cols-1 justify-self-end">
              <div className="hidden sm:inline-block">
                <img
                  className="w-12 h-12 rounded-full ml-3 mt-2 mb-2 float-left border"
                  src={fileBlob ? fileBlob : userProfileData.profilePicture}
                />
                <div
                  className="mr-4 pl-4 cursor-pointer select-none float-right my-5 hover:text-gray-500"
                  onClick={() => setisOpen(!isOpen)}
                >
                  Welcome {userProfileData.name == "" ? userProfileData.username : userProfileData.name}
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
            </div>
          </>
        ) : (
          <>
            <div className="grid grid-cols-2 justify-self-end my-auto text-center">
              <a
                href="/"
                className="py-2 text-xs sm:text-lg font-normal p-4 rounded hover-underline-animation"
              >
                About Us
              </a>
              <a
                href="/login"
                className="py-2 text-xs sm:text-lg font-normal p-4 rounded hover-underline-animation"
              >
                Login
              </a>
            </div>
          </>
        )}
      </div>

      {isOpen && (
        <Flip right>
          <div className="relative md:absolute right-0 bg-white shadow-xl rounded-b-xl md:w-1/6 text-center">
            {isAuth &&
              <a
                href="/"
                className="py-2 rounded hover:bg-lightblue text-sm font-normal block"
              >
                Home
            </a>
            }
            {isAuth &&
              <a
                href="/profile"
                className="py-2 rounded hover:bg-lightblue text-sm font-normal block"
              >
                Edit Profile
            </a>
            }
            {isAuth &&
              <a
                href="/dashboard"
                className="py-2 rounded hover:bg-lightblue text-sm font-normal block"
              >
                Dashboard
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
        </Flip>
      )}
    </nav>
  );
}
