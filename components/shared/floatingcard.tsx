import Link from "next/link";

import { LinksLogoBg } from "../../assets/icons";

interface FloatingCardProps {
  title: string;
  verticalHeader: string;
  bottomText: string;
  bottomTextLink: string;
  linkHref: string;
  children: React.ReactNode;
}

export default function FloatingCard({
  title,
  verticalHeader,
  bottomText,
  bottomTextLink,
  linkHref,
  children,
}: FloatingCardProps): JSX.Element {
  return (
    <>
      <div className="min-h-screen flex justify-center">
        <div className="text-center m-auto w-11/12 sm:w-9/12 md:w-6/12 lg:w-5/12 max-w-lg relative z-10">
          {/* TODO: Add font-inter */}
          <h1 className="md:hidden text-lightgray-25 font-black text-4xl mb-2">
            {verticalHeader}
          </h1>
          <h1 className="hidden md:block text-lightgray-25 text-vertical-rl font-black absolute z-0 text-7xl transform rotate-180 top-0 bottom-0 -translate-x-3/4">
            {verticalHeader}
          </h1>

          <div className="text-left relative p-8 border-2 bg-white mb-2 rounded-lg">
            <h2 className="text-center text-2xl mb-5 font-black text-turquoiseGreen tracking-wide">
              {title}
            </h2>
            {children}
          </div>

          <div className="text-center">
            <p className="text-darkgray hover:text-black text-sm">
              {bottomText}{" "}
              <Link href={linkHref}>
                <a className="no-underline text-turquoiseGreen font-bold">
                  {bottomTextLink}
                </a>
              </Link>
            </p>
          </div>
        </div>

        <div className="hidden lg:block absolute bottom-0 left-0 z-0">
          <LinksLogoBg />
        </div>
      </div>
    </>
  );
}
