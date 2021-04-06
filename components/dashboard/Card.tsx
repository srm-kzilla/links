import React, { useState } from "react";

import { DeleteModal } from "./";
import { Spike, Trash, Pencil, Location } from "../../assets/icons";
import { activeLinkProps } from "../../utils/sidebarContext";

interface CardProps {
  onCardClick: () => void;
  link: activeLinkProps;
  onDeleteCard: (_id: string, closeModal: () => void) => void;
}

const Card = ({ link, onCardClick, onDeleteCard }: CardProps): JSX.Element => {
  const [isDeleteModalOpen, setIsdeleteModalOpen] = useState<boolean>(false);

  return (
    <>
      <div
        onClick={onCardClick}
        className="flex flex-wrap items-center justify-between bg-white group my-6 mx-3 md:mx-20 cursor-pointer shadow-custom rounded-xl w-auto md:w-3/5 overflow-hidden relative md:py-6"
      >
        <div
          className={`${
            link.status ? "bg-statusGreen" : "bg-statusRed"
          } h-6 w-full md:h-full md:w-6 md:group-hover:w-16 -mt-2 md:mt-0 block md:absolute left-0 bottom-0 top-0 items-center justify-between`}
        >
          <figure className="w-0 group-hover:w-8 cursor-pointer pt-10 shadow-2xl hidden md:flex mx-auto">
            <img width="40px" src={link.image} alt={link.title.trim()} />
          </figure>
        </div>

        <div className="flex justify-center my-2 items-center md:text-left md:justify-start md:ml-20 mx-auto md:mx-0">
          <figure className="md:hidden w-8 mr-4">
            <img width="40px" src={link.image} alt={link.title.trim()} />
          </figure>

          <div className="flex flex-col transition items-start">
            <h2 className="text-xl md:text-3xl font-bold">{link.title}</h2>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs md:text-md md:inline-block"
            >
              {link.url}
            </a>
          </div>
        </div>

        <div className="flex w-full md:w-auto justify-evenly my-2">
          <button
            onClick={() => setIsdeleteModalOpen(true)}
            className="focus:outline-none cursor-pointer mx-2 md:mx-4"
          >
            <Trash />
          </button>
          <button className="focus:outline-none cursor-pointer mx-2 md:mx-4">
            <Spike />
          </button>
          <button className="focus:outline-none cursor-pointer mx-2 md:mx-4">
            <Pencil />
          </button>
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="focus:outline-none cursor-pointer mx-2 md:mx-4"
          >
            <Location />
          </a>
        </div>
      </div>

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsdeleteModalOpen(false)}
        linkId={link._id}
        onDeleteLink={onDeleteCard}
      />
    </>
  );
};

export default Card;
