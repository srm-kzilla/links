import makeCarousel from "react-reveal/makeCarousel";
import Fade from "react-reveal/Fade";

import { heroLandingCards } from "../../utils/constants";
import { shuffleArray } from "../../utils/functions";

const CarouselUI = ({ children }) => (
  <div className="relative w-11/12 md:w-8/12 h-20">{children}</div>
);
const Carousel = makeCarousel(CarouselUI);

export default function HeroLanding() {
  return (
    <>
      <div className="max-w-2xl mx-0 sm:mx-12 md:mx-16 lg:mx-auto flex flex-col">
        <div className="flex flex-row w-full">
          <Carousel defaultWait={3000}>
            {shuffleArray(heroLandingCards).map((item) => {
              return (
                <Fade>
                  <div key={item.id} className="flex items-center px-2 py-6 sm:py-4 sm:px-4 bg-white shadow-xl rounded-lg ">
                    <div className="mx-1 sm:mx-4 h-8 w-8 sm:h-12 sm:w-12">
                      <img className="rounded-md" src={item.image} />
                    </div>
                    <p className="mx-1 sm:mx-4 text-gray-400 mr-1 sm:mr-3 text-sm sm:text-lg text-center">
                      {item.title}
                    </p>
                  </div>
                </Fade>
              );
            })}
          </Carousel>
        </div>
        <div className="flex flex-row-reverse items-end">
          <Carousel defaultWait={3000}>
            {shuffleArray(heroLandingCards).map((item) => {
              return (
                <Fade>
                  <div key={item.id} className="flex items-center px-2 py-6 sm:py-4 sm:px-4 bg-white shadow-xl rounded-lg ">
                    <div className="mx-1 sm:mx-4 h-8 w-8 sm:h-12 sm:w-12">
                      <img className="rounded-md" src={item.image} />
                    </div>
                    <p className="mx-1 sm:mx-4 text-gray-400 mr-1 sm:mr-3 text-sm sm:text-lg text-center">
                      {item.title}
                    </p>
                  </div>
                </Fade>
              );
            })}
          </Carousel>

          <div className="flex items-start mb-5 sm:mb-8 w-14 sm:w-20 md:w-28 lg:w-32 h-24 sm:h-36 border-l-4 border-b-4 border-dashed"></div>
        </div>
        <div className="flex flex-row items-end">
          <Carousel defaultWait={3000}>
            {shuffleArray(heroLandingCards).map((item) => {
              return (
                <Fade>
                  <div key={item.id} className="flex items-center px-2 py-6 sm:py-4 sm:px-4 bg-white shadow-xl rounded-lg ">
                    <div className="mx-1 sm:mx-4 h-8 w-8 sm:h-12 sm:w-12">
                      <img className="rounded-md" src={item.image} alt="logo" />
                    </div>
                    <p className="mx-1 sm:mx-4 text-gray-400 mr-1 sm:mr-3 text-sm sm:text-lg text-center">
                      {item.title}
                    </p>
                  </div>
                </Fade>
              );
            })}
          </Carousel>
          <div className="flex items-start mb-5 sm:mb-8 w-14 sm:w-20 md:w-28 lg:w-32 h-24 sm:h-36 border-r-4 border-b-4 border-dashed"></div>
        </div>
      </div>
    </>
  );
}
