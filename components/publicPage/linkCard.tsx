import Slide from "react-reveal/Slide";
import React from "react";

interface LinkCardProps {
    title: string;
    url: string;
    image: string;
}

const LinkCard = ({ title, url, image }: LinkCardProps): JSX.Element => {
    return (
        <>
            <Slide left>
                <a href={url} className="px-10" target="_blank" rel="noopener noreferrer">
                    <img className="mx-auto -mb-4" width="55" height="55" src={image} />
                    <div className="bg-white cursor-pointer shadow-custom rounded-2xl text-center">
                        <h1 className="text-2xl font-extrabold py-6">{title}</h1>
                    </div>
                </a>
            </Slide>
        </>
    );
}
export default LinkCard;