import { HeroLanding } from "../../assets/icons";

export default function HomeComponent(): JSX.Element {
  return (
    <>
      <div className="bg-white flex flex-col font-sans pt-9 min-h-screen">
        <div className=" hover:mx-auto px-8">
          <main className="flex flex-col-reverse sm:flex-row jusitfy-between items-center py-12">
            <div className="sm:w-2/5 flex flex-col items-center sm:items-start text-center sm:text-left pl-3">
              <h1 className="uppercase text-8xl customGradient font-bold leading-none tracking-wide mb-2">
                One link
              </h1>
              <h2 className="uppercase text-5xl text-statusGreen text-secondary tracking-widest mb-6">
                For all your links
              </h2>
              <p className="text-gray-600 leading-relaxed mb-12">
                Lorem ipsum dolor sit amet, consectetur adipiscing. Vestibulum
                rutrum metus at enim congue scelerisque. Sed suscipit metu non
                iaculis semper consectetur adipiscing elit.
              </p>
              <a
                href="/signup"
                className="bg-lightblue hover:bg-opacity-90 shadow-md focus:outline-none py-3 px-6 uppercase text-lg font-bold text-white rounded-full"
              >
                Get Started
              </a>
            </div>
            <div className="mb-16 sm:mb-0 mt-8 sm:mt-0 sm:w-3/5 sm:pl-12">
              <HeroLanding />
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
