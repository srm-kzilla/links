import React, { useState } from "react";

import { DeleteModal } from "./";
import { Spike, Trash, Pencil, NewWindow } from "../../assets/icons";
import { activeLinkProps } from "../../utils/sidebarContext";
import { truncateTitleText, truncateLinkText } from "../../utils/functions";
import { kzillaxyz } from "../../utils/constants";

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
          className={`${link.status ? "bg-statusGreen" : "bg-statusRed"
            } h-6 w-full md:h-full md:w-6 md:group-hover:w-16 hover:transition duration-75 ease-in-out -mt-2 md:mt-0 block md:absolute left-0 bottom-0 top-0 items-center justify-between`}
        >
          <figure className="w-0 group-hover:w-8 cursor-pointer pt-10 shadow-2xl hidden md:flex mx-auto">
            <img className="rounded" width="40px" src={link.image} />
          </figure>
        </div>

        <div className="flex justify-end my-2 items-center md:text-left md:justify-start md:ml-20 mx-4 md:mx-0">
          <figure className="md:hidden w-8 mr-4">
            <img className="rounded" width="40px" src={link.image} alt={link.title.trim()} />
          </figure>

          <div className="flex flex-col transition items-start">
            <h2 className="text-xl md:text-3xl font-bold">{truncateTitleText(link.title)}</h2>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs md:text-md md:inline-block"
            >
              {truncateLinkText(link.url)}
            </a>
          </div>
        </div>

        <div className="flex w-full md:w-auto justify-evenly my-2 sm:mr-14">
          <a
            href={`${kzillaxyz}${link.shortCode}`}
            target="_blank"
            rel="noopener noreferrer"
            className="focus:outline-none cursor-pointer mx-2 pt-1 md:mx-4"
            title="Open link in new window"
          >
            <NewWindow />
          </a>
          <button title="Edit Link" className="focus:outline-none cursor-pointer mx-2 md:mx-4">
            <Pencil />
          </button>
          <a
            href={`${kzillaxyz}${link.analyticsCode}`}
            target="_blank"
            rel="noopener noreferrer"
            className="focus:outline-none cursor-pointer pt-1"
            title="Check Analytics"
          >
            <button className="focus:outline-none cursor-pointer mx-2 md:mx-4">
              <Spike />
            </button>
          </a>
          <button
            onClick={() => setIsdeleteModalOpen(true)}
            className="focus:outline-none cursor-pointer mx-2 md:mx-4"
            title="Delete Link"
          >
            <Trash />
          </button>
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
