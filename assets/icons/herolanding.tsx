import { Instagram, LeftDotted, RightDotted, Logo, Linkedin } from "../icons";
export default function HeroLanding() {
  return (
    <>
      <div className=" max-w-2xl mx-0 sm:mx-12 md:mx-16 lg:mx-auto flex flex-col">
        <div className="flex flex-row">
          <div className="flex items-center px-2 py-2 sm:py-4 sm:px-4 bg-white shadow-xl rounded-lg">
            <div className="mx-1 sm:mx-4 h-8 w-8 sm:h-12 sm:w-12">
              <Linkedin />
            </div>
            <p className="mx-1 sm:mx-4 text-gray-400 mr-1 sm:mr-3 text-md sm:text-lg text-center">
              https://www.linkedin.com/in
            </p>
          </div>
        </div>
        <div className="flex flex-row-reverse items-end">
          <div className="flex items-center px-2 py-2 sm:py-4 sm:px-4 bg-white shadow-xl rounded-lg ">
            <div className="mx-1 sm:mx-4 h-8 w-8 sm:h-12 sm:w-12">
              <Linkedin />
            </div>
            <p className="mx-1 sm:mx-4 text-gray-400 mr-1 sm:mr-3 text-md sm:text-lg text-center">
              https://www.instagram.com
            </p>
          </div>
          <div className="flex items-start mb-5 sm:mb-8 w-10 sm:w-16 md:w-20 lg:w-24">
            <LeftDotted />
          </div>
        </div>
        <div className="flex flex-row items-end">
          <div className="flex items-center px-2 py-2 sm:py-4 sm:px-4 bg-white shadow-xl rounded-lg ">
            <div className="mx-1 sm:mx-4 h-8 w-8 sm:h-12 sm:w-12">
              <Logo />
            </div>
            <p className="mx-1 sm:mx-4 text-gray-400 mr-1 sm:mr-3 text-md sm:text-lg text-center">
              https://www.linkedin.com/in
            </p>
          </div>
          <div className="flex items-start mb-5 sm:mb-8 w-14 sm:w-20 md:w-28 lg:w-32">
            <RightDotted />
          </div>
        </div>
      </div>
    </>
  );
}
