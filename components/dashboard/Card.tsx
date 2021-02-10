import React, { useState } from "react";

import Logo from "./Logo";
import DeleteModal from "./DeleteModal";
import { Spike, Trash, Pencil, Location } from "../../assets/icons";
import { activeLinkProps } from "../../utils/sidebarContext";

interface CardProps {
  onCardClick: () => any;
  link: activeLinkProps;
}

const Card = ({ link, onCardClick }: CardProps): JSX.Element => {
  const [isDeleteModalOpen, setIsdeleteModalOpen] = useState<boolean>(false);

  return (
    <>
      <div
        onClick={onCardClick}
        className="bg-white h-28 px-0 pt-0 my-6 mx-3 md:mx-20 shadow-custom rounded-xl w-auto md:w-3/5"
      >
        <div className="float-left">
          <Logo image={link.image} alt={link.title} />
        </div>

        <button
          onClick={() => setIsdeleteModalOpen(true)}
          className="ml-4 md:ml-6 mr-3 cursor-pointer mt-12 float-right"
        >
          <Trash />
        </button>

        <button className="ml-4 md:ml-6 cursor-pointer mt-12 float-right">
          <Spike />
        </button>

        <button className="ml-4 md:ml-6 cursor-pointer mt-12 float-right">
          <Pencil />
        </button>

        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-4 md:ml-6 cursor-pointer mt-12 float-right"
        >
          <Location />
        </a>

        <h2 className="text-2xl md:text-3xl font-bold pt-10 md:pt-7">
          {link.title}
        </h2>
        <a className="hidden md:inline-block">{link.url}</a>
        <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsdeleteModalOpen(false)}
        />
      </div>
    </>
  );
};

export default Card;
