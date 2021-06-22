import Link from "next/link";

import { LinksLogoBg } from "../../assets/icons";

interface FloatingCardProps {
    title: string;
    verticalHeader: string;
    bottomText: string;
    bottomTextLink: string;
    linkHref: string;
    children: unknown;
}

export default function FloatingCard({ title, verticalHeader, bottomText, bottomTextLink, linkHref, children }: FloatingCardProps): JSX.Element {
    return (
        <>
            <div className="min-h-screen flex justify-center">
                <div className="m-auto md:w-2/4 lg:w-1/4 relative z-10">
                    {/* TODO: Add font-inter */}
                    <div className="text-lightgraycustom font-black styledHeader hidden md:block absolute float-left z-0 text-7xl text-center">
                        {verticalHeader}
                    </div>
                    <div className="block sm:hidden text-lightgraycustom font-black text-center mb-10 text-3xl">
                        {verticalHeader}
                    </div>
                    <div className="relative p-8 border-2 bg-white mb-2 rounded-lg">
                        <h1 className="text-center text-2xl mb-5 font-black text-turquoiseGreen tracking-wide">
                            {title}
                        </h1>
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
