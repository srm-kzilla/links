import { useContext, useState } from "react";
import { parseCookies } from "nookies";
import { MdContentCopy } from "react-icons/md";

import {
  successHandler,
  errorHandler,
  patchUserProfile,
} from "../../utils/api";
import { baseUrl } from "../../utils/constants";
import { ImageContext } from "../../store/profileImageContext";
import { FileUploader } from "../profile";
import { ChangePasswordModal } from "../profile";
import { LinksLogoBg, EditPencil } from "../../assets/icons";
import { truncateText } from "../../utils/functions";

export default function ProfileComponent({ _resProfile }): JSX.Element {
  const { fileBlob } = useContext(ImageContext);

  const [name, setName] = useState<string>(_resProfile.name);
  const [username, setUserName] = useState<string>(_resProfile.username);
  const [bio, setBio] = useState<string>(_resProfile.bio);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [isSubmittingProfile, setIsSubmittingProfile] =
    useState<boolean>(false);
  const [showNameInput, setShowNameInput] = useState<boolean>(false);
  const [showUserNameInput, setShowUserNameInput] = useState<boolean>(false);
  const [showBioInput, setShowBioInput] = useState<boolean>(false);

  const updateUserProfile = () => {
    (async () => {
      setIsSubmittingProfile(true);
      const { authToken } = parseCookies();
      const userData = {
        name: name,
        username: username,
        bio: bio,
      };

      const _res = await patchUserProfile(authToken, userData);
      if (_res) {
        setIsSubmittingProfile(false);
        successHandler(_res.data.message);
      }
      setIsSubmittingProfile(false);
    })();
  };

  const copyToClipBoard = async (copyMe) => {
    try {
      await navigator.clipboard.writeText(copyMe);
      successHandler("📋 Link copied to clipboard!");
    } catch (err) {
      errorHandler(err);
    }
  };

  return (
    <>
      <div className="absolute text-xl lg:text-6xl top-28 left-32 hidden lg:block font-black tracking-wide text-lightgray opacity-30">
        <h1>EDIT PROFILE</h1>
      </div>

      <div className="absolute block md:hidden left-1/2">
        <h1 className="relative -left-1/2 text-xl top-16 font-black tracking-wide text-lightgray opacity-30">
          EDIT PROFILE
        </h1>
      </div>

      <div className="relative flex items-center justify-center flex-col mt-4 md:float-left md:ml-60 md:mt-24 z-40">
        <div className="relative">
          <div className="flex items-center justify-center w-36 h-36 rounded-full overflow-hidden mt-40">
            <img
              className="w-auto max-h-full border"
              src={fileBlob ? fileBlob : _resProfile.profilePicture}
            />
          </div>
          <FileUploader />
        </div>

        <div className="flex flex-col w-5/6 sm:w-full">
          <div className="flex flex-row items-center justify-center m-2">
            {!showNameInput && (
              <p className="text-center font-bold text-lg text-lightgray">
                {name ? truncateText(name, 20, 16) : "Name"}
              </p>
            )}
            {showNameInput && (
              <input
                value={name}
                type="text"
                maxLength={50}
                name="name"
                autoComplete="off"
                onBlur={() => setShowNameInput(false)}
                onKeyPress={(e) => {
                  e.key == "Enter" && setShowNameInput(false);
                }}
                className="border-b-2 border-lightgraycustom text-lightgray p-1 focus:outline-none w-full"
                placeholder="John Doe"
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            )}
            {!showNameInput && (
              <button
                onClick={() => setShowNameInput(true)}
                className="pl-3 focus:outline-none"
              >
                <i>
                  <EditPencil />
                </i>
              </button>
            )}
          </div>
          <div className="w-full flex items-center justify-center">
            <a
              className="text-left text-lightgraycustom font-normal"
              href={`${baseUrl}${_resProfile.username}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <strong>
                {baseUrl}
                {_resProfile.username}
              </strong>
            </a>
            <button
              onClick={() =>
                copyToClipBoard(`${baseUrl}${_resProfile.username}`)
              }
              className="float-right focus:outline-none"
              title="Copy to Clipboard"
            >
              <i className="float-right mt-1 ml-2 grid-cols-1 cursor-pointer text-lightgraycustom">
                <MdContentCopy />
              </i>
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center flex-col md:absolute md:top-56 md:right-2 md:pl-48 md:w-4/5 mt-4">
        <div className="w-5/6 md:w-2/6">
          <p className="flex text-lightgray text-lg font-bold">Username</p>
        </div>
        {!showUserNameInput && (
          <div className="flex flex-row w-5/6 md:w-2/6">
            <p className="flex text-lightgraycustom text-lg font-semibold">
              {username ? username : "Not set"}
            </p>
            <button
              onClick={() => setShowUserNameInput(true)}
              className="pl-3 focus:outline-none"
            >
              <i>
                <EditPencil />
              </i>
            </button>
          </div>
        )}
        {showUserNameInput && (
          <input
            value={username}
            type="text"
            name="username"
            autoComplete="off"
            maxLength={30}
            onBlur={() => setShowUserNameInput(false)}
            onKeyPress={(e) => {
              e.key == "Enter" && setShowUserNameInput(false);
            }}
            className="border-b-2 border-lightgraycustom p-1 focus:outline-none w-5/6 sm:w-2/6 text-lightgraycustom"
            placeholder="johndoe123"
            onChange={(e) => {
              setUserName(e.target.value);
            }}
          />
        )}
        <div className="mt-10 w-5/6 md:w-2/6">
          <p className="text-lightgray text-lg font-bold">About Me</p>
        </div>
        {!showBioInput && (
          <div className="flex flex-row w-5/6 md:w-2/6">
            <p className="flex text-lightgraycustom text-lg font-semibold">
              {bio ? bio : "Hey There! I'm using Links"}
            </p>
            <button
              onClick={() => setShowBioInput(true)}
              className="pl-3 focus:outline-none"
            >
              <i>
                <EditPencil />
              </i>
            </button>
          </div>
        )}
        {showBioInput && (
          <textarea
            value={bio}
            className="grayBottomBorder w-5/6 md:w-2/6 focus:outline-none text-lightgraycustom border"
            rows={2}
            maxLength={100}
            onBlur={() => setShowBioInput(false)}
            placeholder="Here goes my cool bio..."
            onChange={(e) => {
              setBio(e.target.value);
            }}
          />
        )}
        <div className="flex flex-col sm:flex-row items-center justify-center w-2/3 sm:w-2/6 mt-14">
          <button
            onClick={() => setModalOpen(true)}
            className="bg-white border-2 border-statusRed focus:outline-none hover:bg-opacity-80 text-statusRed text-xs font-bold w-full py-3 sm:py-2 px-3 rounded"
          >
            CHANGE PASSWORD
          </button>
          <button
            type="submit"
            disabled={isSubmittingProfile}
            onClick={() => updateUserProfile()}
            className={`bg-white border-2 ${
              isSubmittingProfile
                ? "border-lightgray text-lightgray"
                : "border-primaryGreen-200 text-primaryGreen-200"
            } focus:outline-none hover:bg-opacity-80 text-xs font-bold w-full sm:ml-4 mt-4 sm:mt-0 mb-12 sm:mb-0 py-3 sm:py-2 px-3 rounded`}
          >
            {isSubmittingProfile ? "Please wait..." : "SAVE CHANGES"}
          </button>
        </div>
      </div>

      <ChangePasswordModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
      />

      <div className="hidden lg:block absolute bottom-0 z-0">
        <LinksLogoBg />
      </div>
    </>
  );
}
