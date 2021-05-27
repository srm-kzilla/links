import { HeroLanding } from "../../assets/icons";

export default function HomeComponent(): JSX.Element {
  return (
    <>
      <div className="bg-white flex flex-col font-sans pt-20 min-h-screen px-0 sm:px-8">
        <div className="grid grid-cols-0 xl:grid-cols-3">
          <h1 className="col-span-2 uppercase text-5xl sm:text-8xl lg:text-xxl customGradientInverse font-bold leading-none tracking-wide mb-2 mx-auto md:ml-0">
            One link...
          </h1>
          <div></div>
        </div>
        <div className="grid grid-cols-0 md:grid-cols-2 w-full my-auto">
          <div className=" md:col-span-1 my-auto">
            <HeroLanding />
          </div>
          <div className="md:col-span-1 my-auto">
            <h2 className="uppercase text-3xl sm:text-6xl lg:text-7xl text-center text-lightblue text-secondary tracking-wider mb-6">
              For all your links
            </h2>
            <p className="text-gray-600 text-md sm:text-lg lg:text-2xl text-center leading-relaxed px-10 xl:px-28 2xl:px-40">
              Lorem ipsum dolor sit amet, consectetur adipiscing. Vestibulum
              rutrum metus at enim congue scelerisque. Sed suscipit metu non
              iaculis semper consectetur adipiscing elit.
            </p>
            <div className=" flex items-center justify-center pb-4">
              <a
                href="/signup"
                className="bg-lightblue flex items-center justify-center rounded hover:bg-opacity-90 shadow-md focus:outline-none p-3 uppercase text-lg font-bold text-white mt-9 w-10/12 sm:w-2/5"
              >
                Get Started
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
