import React, { FC } from "react";
import { AuctionType } from "../models/auction";
import Image from "next/image";
import TrashIcon from "@heroicons/react/outline/TrashIcon";
import PencilIcon from "@heroicons/react/outline/PencilIcon";
import ClockIcon from "@heroicons/react/outline/ClockIcon";

//TODO: add function to edit and delete auction

interface Props {
  auction: AuctionType;
  activeTab: number;
}

const AuctionCard:FC<Props> = ({ auction, activeTab}) => {
  const inProgress = (auction: AuctionType) => {
    if (new Date(auction.end_date) > new Date()) {
      return "In progress";
    } else {
      return "Done";
    }
  };

  const countdown = (auction: AuctionType) => {
    if (new Date(auction.end_date) > new Date()) {
      const diffInMilliseconds =
        new Date(auction.end_date).getTime() - new Date().getTime();
      const diffInHours = diffInMilliseconds / (1000 * 60 * 60);
      return Math.ceil(diffInHours); // Use Math.ceil to round up to the nearest hour
    }
    return null; // Return 0 if the auction has ended
  };

  const showButtons = activeTab === 0 && inProgress(auction) === "In progress";

  return (
    <div className="flex flex-col bg-white w-52 h-72 rounded-2xl p-2 font-light gap-1">
      <div className="flex justify-between text-xs">
        <div
          className={`rounded-full px-2 py-1 ${
            inProgress(auction) === "In progress"
              ? "bg-fluoro-yellow-light"
              : "bg-dark-gray text-white"
          }`}
        >
          {inProgress(auction)}
        </div>
        {countdown(auction) === null ? null : (
          <div className={`flex justify-center items-center gap-1 rounded-full px-2 py-1 ${
            activeTab === 1
              ? "bg-red-300"
              : ""
          }`}>
            <div>{countdown(auction)}h</div>
            <div className="w-4 h-4">
              <ClockIcon />
            </div>
          </div>
        )}
      </div>
      <div className="text-lg">{auction.title}</div>
      <div className="font-medium">{auction.start_price} €</div>
      <div className="object-cover w-full h-full rounded-2xl">
        <Image
          width={100}
          height={100}
          src={`http://localhost:8080/files/${auction.image}`}
          alt={auction.title}
          className={`object-cover w-full rounded-2xl ${showButtons ? "h-36" : "h-44"}`}
        />
      </div>
      {showButtons && (<div className="flex justify-between items-center gap-1">
        <div className="bg-white border border-dark-gray px-2 py-1 rounded-xl">
          <TrashIcon className="w-4 h-4" />
        </div>
        <div className="flex justify-center items-center gap-1 bg-dark-gray text-white px-2 py-1 rounded-xl w-full">
          <div>
            <PencilIcon className="w-4 h-4" />
          </div>
          <div>Edit</div>
        </div>
      </div>)}
      
    </div>
  );
};

export default AuctionCard;