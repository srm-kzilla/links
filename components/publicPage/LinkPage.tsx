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
      <div className="min-h-screen max-w-xl mx-auto block md:hidden">
        <div className="flex flex-col items-center justify-center p-4">
          <img
            className="w-2/6 h-2/6 rounded-full border shadow-md mt-20"
            src={_resLinks.profilePicture}
          />
          <h1 className="my-5 text-sm xs:text-2xl font-extrabold tracking-wide uppercase text-turquoiseGreen">
            {truncateText((_resLinks.name || _resLinks.username), 25, 20)}
          </h1>
          <p className="text-center my-2 p-2">{_resLinks.bio}</p>
        </div>

        <div className="px-2 lg:px-44">
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

      <div className="hidden md:flex min-h-screen">
        <div className="container mx-auto px-6 sm:px-12 flex flex-col-reverse sm:flex-row items-center">
          <div className="sm:w-2/5 flex flex-col items-start mt-8 sm:mt-0 p-8 min-h-full justify-around">
            <div className="flex flex-col items-center justify-items-center border-2 rounded-lg w-full p-2 xl:p-8">
              <img
                className="w-2/6 h-2/6 rounded-full my-5"
                src={_resLinks.profilePicture}
              />

              <div className="flex flex-col w-4/6 my-2">
                <h1 className="font-bold text-turquoiseGreen text-lg">
                  Username
                </h1>
                <div className="flex">
                  <h1 className="font-bold text-lightgraycustom text-xl">
                    {_resLinks.username}
                  </h1>
                  <button className="text-lightgraycustom ml-2 outline-none focus:outline-none" onClick={() => copyToClipBoard(`${baseUrl}${_resLinks.username}`)}>
                    <MdContentCopy />
                  </button>
                </div>
              </div>

              <div className="flex flex-col w-4/6 my-2">
                <h1 className="font-bold text-turquoiseGreen text-lg">Bio</h1>
                <p className=" text-lightgraycustom font-bold">{_resLinks.bio}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col min-h-full justify-center sm:w-3/5">
            <h1 className="text-5xl tracking-wide font-bold uppercase text-lightgray-50">
              {truncateText((_resLinks.name || _resLinks.username), 25, 20)}
            </h1>
            <div className="bg-backgroundwhite my-4 overflow-auto max-h-96 rounded-lg p-8">
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
