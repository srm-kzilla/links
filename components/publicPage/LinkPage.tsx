import { MdContentCopy } from "react-icons/md";
import { errorHandler, successHandler } from "../../utils/api";
import { baseUrl } from "../../utils/constants";
import { truncateText } from "../../utils/functions";
import { LinkCard } from "../publicPage";

export interface CardLink {
  _id: string;
  title: string;
  url: string;
  image: string;
  status: boolean;
  views: number;
  clicks: number;
  userId: string;
  username: string;
  analyticsCode: string;
  shortCode: string;
  createdAt: number;
}

export default function LinkPageComponent({ _resLinks }) {
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
      <div className="min-h-screen max-w-xl mx-auto block xl:hidden">
        <div className="flex flex-col items-center justify-center p-4">
          <div className="flex items-center justify-center w-36 h-36 rounded-full overflow-hidden mt-20">
            <img
              className="w-auto max-h-full border"
              src={_resLinks.profilePicture}
              alt="profile-image"
            />
          </div>
          <h1 className="my-5 text-sm xs:text-2xl font-extrabold tracking-wide uppercase text-primaryGreen-300">
            {truncateText(_resLinks.name || _resLinks.username, 25, 20)}
          </h1>
          <p className="text-center my-2 p-2 word-wrapping w-full">
            {_resLinks.bio || "Hey There! I am using Links!"}
          </p>
        </div>

        <div className="px-2">
          <div className="grid grid-cols-1 gap-3 mt-3 pb-10 px-5">
            {_resLinks.result.map((link) => (
              <LinkCard
                key={link._id}
                title={link.title}
                shortCode={link.shortCode}
                image={link.image}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="hidden xl:block w-full">
        <div className="grid grid-cols-10 h-screen gap-32 w-10/12 mx-auto">
          <div className="col-span-4 flex flex-col h-linkPage my-auto items-center justify-items-center border-2 rounded-lg w-full">
            <div className="flex items-center justify-center w-36 h-36 rounded-full overflow-hidden mt-12 mb-3">
              <img
                className="w-auto max-h-full border"
                src={_resLinks.profilePicture}
              />
            </div>

            <div className="flex flex-col w-4/6 my-2">
              <h1 className="font-bold text-primaryGreen-300 text-lg">
                Username
              </h1>
              <div className="flex">
                <h1 className="font-bold text-lightgraycustom text-xl">
                  {_resLinks.username}
                </h1>
              </div>
            </div>

            <div className="flex flex-col w-4/6 my-2">
              <h1 className="font-bold text-primaryGreen-300 text-lg">Bio</h1>
              <p className=" text-lightgraycustom font-bold word-wrapping h-28">
                {_resLinks.bio || "Hey There! I am using Links!"}
              </p>
              <div className="flex items-center justify-center my-2">
                <button
                  onClick={() =>
                    copyToClipBoard(`${baseUrl}${_resLinks.username}`)
                  }
                  className="bg-white w-4/6 py-2 border-2 rounded-md border-primaryGreen-300 text-primaryGreen-300 outline-none focus:outline-none hover:opacity-80 text-md font-bold"
                >
                  COPY PROFILE LINK
                </button>
              </div>
            </div>
          </div>

          <div className="col-span-6 flex flex-col justify-between w-full h-linkPage my-auto">
            <h1 className="text-5xl tracking-wide font-bold uppercase text-lightgray-50 font-Inter">
              {truncateText(_resLinks.name || _resLinks.username, 25, 20)}
            </h1>

            <div className="bg-backgroundwhite h-linkContainer w-full overflow-auto rounded-lg p-8">
              <div className="grid grid-cols-1 gap-3">
                {_resLinks.result.map((link) => (
                  <LinkCard
                    key={link._id}
                    title={link.title}
                    shortCode={link.shortCode}
                    image={link.image}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
