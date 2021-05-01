import LinkCard from "../../components/publicPage/linkCard";

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


export default function LinkPageComponent({ _resLinks, _resProfile }) {
  return (
    <>
      <div className="flex items-center justify-center">
        <img
          className="w-24 h-24 rounded-full mt-20 mr-8 border shadow-md"
          src={_resProfile.profilePicture}
        />
        <h1 className="mt-20 ml-4 font-extrabold text-2xl sm:text-4xl">
          {_resProfile.name == "" ? _resProfile.username : _resProfile.name}
        </h1>
      </div>
      <p className="text-center my-5">{_resProfile.bio}</p>
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
