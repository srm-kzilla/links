import { HeroLanding } from "../../assets/icons";

export default function HomeComponent(): JSX.Element {
  return (
    <>
      <div className="bg-white flex flex-col font-sans pt-9 min-h-screen px-8">
        {/* <div className="px-8"> */}
        {/* <main className="flex flex-col-reverse sm:flex-row jusitfy-between items-center py-12"> */}
        {/* <div className="sm:w-2/5 flex flex-col items-center sm:items-start text-center sm:text-left pl-3"> */}
        <div className="grid grid-cols-0 xl:grid-cols-3 pt-20">
          <h1 className="col-span-2 uppercase text-6xl sm:text-8xl lg:text-xxl customGradientInverse font-bold leading-none tracking-wide mb-2">
            One link...
          </h1>

          <div></div>
        </div>
        <div className="grid grid-cols-0 md:grid-cols-9 lg:grid-cols-2 2xl:grid-cols-7 w-full">
          <div className="mx-8 my-8 md:col-span-4 lg:col-span-1 2xl:col-span-3">
            <HeroLanding />
          </div>
          <div className="w-full my-8 md:col-span-5 lg:col-span-1 2xl:col-span-4">
            <h2 className="uppercase text-7xl text-lightblue text-secondary tracking-wider mb-6">
              For all your links
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed w-9/12">
              Lorem ipsum dolor sit amet, consectetur adipiscing. Vestibulum
              rutrum metus at enim congue scelerisque. Sed suscipit metu non
              iaculis semper consectetur adipiscing elit.
            </p>

            <a
              href="/signup"
              className="bg-lightblue flex items-center justify-center rounded hover:bg-opacity-90 w-2/5  shadow-md focus:outline-none p-3 uppercase text-lg font-bold text-white mt-9"
            >
              Get Started
            </a>
          </div>
        </div>
        {/* </main> */}
      </div>
      {/* </div> */}
    </>
  );
}
