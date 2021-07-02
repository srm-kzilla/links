import makeCarousel from "react-reveal/makeCarousel";
import Fade from "react-reveal/Fade";

import { heroLandingCards } from "../../utils/constants";
import { shuffleArray } from "../../utils/functions";

const CarouselUI = ({ children }) => (
  <div className="heroCardContainer md-heroCardContainer">{children}</div>
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
                <Fade key={item.title.trim()}>
                  <div className="heroCard sm-heroCard bg-white shadow-xl rounded-lg">
                    <div className="mx-1 sm:mx-4 h-8 w-8 sm:h-12 sm:w-12">
                      <img className="rounded-md" src={item.image} />
                    </div>
                    <p className="mx-1 sm:mx-4 text-gray-400 mr-1 sm:mr-3 text-xs sm:text-lg text-center">
                      {item.title}
                    </p>
                  </div>
                </Fade>
              );
            })}
          </Carousel>
        </div>
        <div className="flex flex-row-reverse alignItemEnd">
          <Carousel defaultWait={3000}>
            {shuffleArray(heroLandingCards).map((item) => {
              return (
                <Fade key={item.title.trim()}>
                  <div className="heroCard sm-heroCard bg-white shadow-xl rounded-lg">
                    <div className="mx-1 sm:mx-4 h-8 w-8 sm:h-12 sm:w-12">
                      <img className="rounded-md" src={item.image} />
                    </div>
                    <p className="mx-1 sm:mx-4 text-gray-400 mr-1 sm:mr-3 text-xs sm:text-lg text-center">
                      {item.title}
                    </p>
                  </div>
                </Fade>
              );
            })}
          </Carousel>

          <div className="leftDotted sm-leftDotted md-leftDotted lg-leftDotted"></div>
        </div>

        <div className="flex flex-row alignItemEnd">
          <Carousel defaultWait={3000}>
            {shuffleArray(heroLandingCards).map((item) => {
              return (
                <Fade key={item.title.trim()}>
                  <div className="heroCard sm-heroCard bg-white shadow-xl rounded-lg">
                    <div className="mx-1 sm:mx-4 h-8 w-8 sm:h-12 sm:w-12">
                      <img className="rounded-md" src={item.image} alt="logo" />
                    </div>
                    <p className="mx-1 sm:mx-4 text-gray-400 mr-1 sm:mr-3 text-xs sm:text-lg text-center">
                      {item.title}
                    </p>
                  </div>
                </Fade>
              );
            })}
          </Carousel>
          <div className="rightDotted sm-rightDotted md-rightDotted lg-rightDotted"></div>
        </div>
      </div>
    </>
  );
}
