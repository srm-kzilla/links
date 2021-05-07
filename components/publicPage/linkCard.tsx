import Slide from "react-reveal/Slide";
import React from "react";

import { kzillaxyzdomain } from "../../utils/constants";

interface LinkCardProps {
    title: string;
    shortCode: string;
    image: string;
}

const LinkCard = ({ title, shortCode, image }: LinkCardProps): JSX.Element => {
    return (
        <>
            <Slide left>
                <a href={`${kzillaxyzdomain}${shortCode}`} className="px-10" target="_blank" rel="noopener noreferrer">
                    <img className="mx-auto -mb-4 rounded" width="55" height="55" src={image} />
                    <div className="bg-white cursor-pointer shadow-custom rounded-2xl text-center">
                        <h1 className="text-2xl font-extrabold py-6">{title}</h1>
                    </div>
                </a>
            </Slide>
        </>
    );
}
export default LinkCard;