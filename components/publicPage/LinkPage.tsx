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

  return (
    <>
      <div className="flex items-center justify-center">
        <img
          className="w-24 h-24 rounded-full mt-20 mr-8 ml-3 border shadow-md"
          src={_resLinks.profilePicture}
        />
        <div className="flex flex-col">
          <h1 className="mt-24 font-extrabold text-2xl sm:text-4xl">
            {_resLinks.name || _resLinks.username }
          </h1>
          <p className="my-2 pr-2">{_resLinks.bio}</p>
        </div>
      </div>
      <div className="px-2 lg:px-44">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-10">
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
    </>
  );
}
