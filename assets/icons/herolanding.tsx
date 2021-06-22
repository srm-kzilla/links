import { Instagram, LeftDotted, RightDotted, Logo, Linkedin } from "../icons";
export default function HeroLanding() {
  return (
    <>
      <div className="max-w-xl mx-auto">
        <div className="flex flex-col">
          {/* <div className="flex items-center py-4 bg-white shadow-md rounded-lg w-2/3">
            <div className="mx-4">
              <Linkedin />
            </div>
            <p className="text-gray-400 mx-3 text-lg text-center">
              https://www.linkedin.com/in/
            </p>
          </div> */}
          <div className="flex flex-row">
            <div className="flex items-end">
              <div className="flex items-center py-4 bg-white shadow-md rounded-lg">
                <div className="mx-4">
                  <Linkedin />
                </div>
                <p className="text-gray-400 mr-3 text-lg text-center">
                  https://www.linkedin.com/in/
                </p>
              </div>
            </div>
            <div className="flex items-start"></div>
          </div>
          <div className="flex flex-row-reverse">
            <div className="flex items-end">
              <div className="flex items-center py-4 bg-white shadow-md rounded-lg ">
                <div className="mx-4">
                  <Linkedin />
                </div>
                <p className="text-gray-400 mr-3 text-lg text-center">
                  https://www.instagram.com/in/
                </p>
              </div>
            </div>
            <div className="flex items-start mb-8">
              <LeftDotted />
            </div>
          </div>
          <div className="flex flex-row">
            <div className="flex items-end">
              <div className="flex items-center py-4 bg-white shadow-md rounded-lg ">
                <div className="mx-4 h-12 w-12">
                  <Logo />
                </div>
                <p className="text-gray-400 mr-3 text-lg text-center">
                  https://www.linkedin.com/in/
                </p>
              </div>
            </div>
            <div className="flex items-start mb-8">
              <RightDotted />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
