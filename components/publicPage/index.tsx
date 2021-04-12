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
}


export default function LinkPageComponent({ _resLinks }) {
  return (
    <>
      <div className="flex items-center justify-center">
        <img
          className="w-24 h-24 rounded-full mt-20 mr-8 border shadow-md"
          src="https://bestbody.com.au/wp-content/uploads/2019/11/placeholder-person.png"
        />
        <h1 className="mt-20 ml-4 font-extrabold text-2xl sm:text-4xl">
          {_resLinks.username}
        </h1>
      </div>
      <div className="px-2 lg:px-44">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-10">
          {_resLinks.result.map((link) => (
              <LinkCard
                key={link._id}
                title={link.title}
                url={link.url}
                image={link.image}
              />
          ))}
        </div>
      </div>
    </>
  );
}
