import React, { useState } from "react";

import { DeleteModal } from "./";
import { Spike, Trash, Pencil, Location } from "../../assets/icons";
import { activeLinkProps } from "../../utils/sidebarContext";

interface CardProps {
  onCardClick: () => void;
  link: activeLinkProps;
}

const Card = ({ link, onCardClick }: CardProps): JSX.Element => {
  const [isDeleteModalOpen, setIsdeleteModalOpen] = useState<boolean>(false);

  return (
    <>
      <div
        onClick={onCardClick}
        className="bg-white h-28 px-0 group pt-0 my-6 mx-3 md:mx-20 cursor-pointer shadow-custom rounded-xl w-auto md:w-3/5"
      >
        <div className="float-left">
          <figure
            className={`${
              link.status ? "bg-statusGreen" : "bg-statusRed"
            } group-hover:w-16 z-0 relative cursor-pointer ease-in-out duration-100 w-5 pt-16 pb-12 mr-5 shadow-2xl rounded-l-xl`}
          >
            <img
              className="absolute z-0 w-0 group-hover:w-10 ml-2 justify-between top-10 right-3"
              src={link.image}
              alt={link.title.trim()}
            />
          </figure>
        </div>

        <button
          onClick={() => setIsdeleteModalOpen(true)}
          className="ml-4 md:ml-6 mr-3 focus:outline-none cursor-pointer mt-12 float-right"
        >
          <Trash />
        </button>

        <button className="ml-4 md:ml-6 focus:outline-none cursor-pointer mt-12 float-right">
          <Spike />
        </button>

        <button className="ml-4 md:ml-6 focus:outline-none cursor-pointer mt-12 float-right">
          <Pencil />
        </button>

        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-4 md:ml-6 focus:outline-none cursor-pointer mt-12 float-right"
        >
          <Location />
        </a>

        <h2 className="text-xl md:text-3xl font-bold pt-9 md:pt-7">
          {link.title}
        </h2>
        <a className="text-xs md:text-sm md:inline-block">{link.url}</a>
        <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsdeleteModalOpen(false)}
          linkId={link._id}
        />
      </div>
    </>
  );
};

export default Card;
