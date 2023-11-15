import React, { FC, useEffect, useState } from "react";
import { AuctionType } from "../models/auction";
import Image from "next/image";
import TrashIcon from "@heroicons/react/outline/TrashIcon";
import PencilIcon from "@heroicons/react/outline/PencilIcon";
import ClockIcon from "@heroicons/react/outline/ClockIcon";
import AddEditAuctionForm from "./Topbar/AddEditAuctionForm";
import * as API from "../api/api";
import { countdown } from "../utils/countdown";
import { useGetHighestBidder } from "../hooks/useFetchWinningBid";

interface Props {
  isUserBidder: boolean;
  isCurrentUserWinningBidder: boolean;
  activeTopTab: number | null;
  setWinningBidderId: (id: string) => void;
  auction: AuctionType;
  activeTab: number;
  onClick?: () => void;
}

const AuctionCard: FC<Props> = ({
  isUserBidder,
  isCurrentUserWinningBidder,
  activeTopTab,
  setWinningBidderId,
  auction,
  activeTab,
  onClick,
}) => {
  const [showAddAuctionsForm, setShowAddAuctionsForm] = useState(false);
  const [isUpdateAuction, setIsUpdateAuction] = useState(true);
  const [showEditButtons, setShowEditButtons] = useState(false);
  const currentDate = new Date();
  const auctionInProgress = new Date(auction.end_date) > currentDate;

  const handleUpdateAuctionForm = () => {
    setShowAddAuctionsForm(true);
  };

  const handleDeleteAuction = async (id: string) => {
    try {
      await API.deleteAuction(id);
    } catch (error) {
      console.error("Failed to delete auction:", error);
    }
  };

  const winningBidderId = useGetHighestBidder(auction.id);
  if (winningBidderId) {
    setWinningBidderId(winningBidderId?.data);
  }

  useEffect(() => {
    if (activeTab === 0 && activeTopTab === 2 && auctionInProgress) {
      setShowEditButtons(true);
    }
  }, [activeTab, activeTopTab, auctionInProgress]);

  const inProgress = (auction: AuctionType) => {
    const auctionEndDate = new Date(auction.end_date);
    const now = new Date();

    if (auctionEndDate > now) {
      if (activeTopTab === 1) {
        if (isUserBidder) {
          if (isCurrentUserWinningBidder && isUserBidder) {
            return "Outbid";
          } else if (!isCurrentUserWinningBidder && isUserBidder) {
            return "Winning";
          }
        } else {
          return "In progress";
        }
      } else if (activeTopTab === 2) {
        if (activeTab === 0) {
          return "In progress";
        } else if (activeTab === 1) {
          if (!isCurrentUserWinningBidder && isUserBidder) {
            return "Outbid";
          } else if (isCurrentUserWinningBidder && isUserBidder) {
            return "Winning";
          }
        }
      }
    } else {
      return "Done";
    }
  };

  return (
    <div
      onClick={onClick}
      className="flex flex-col bg-white w-52 h-72 rounded-2xl p-2 font-light gap-1"
    >
      <div className="flex justify-between text-xs">
        <div
          className={`rounded-full px-2 py-1 ${
            inProgress(auction) === "In progress"
              ? "bg-fluoro-yellow-light"
              : inProgress(auction) === "Winning"
              ? "bg-fluoro-green"
              : inProgress(auction) === "Outbid"
              ? "bg-red-300"
              : "bg-dark-gray text-white"
          }`}
        >
          {inProgress(auction)}
        </div>
        {countdown(auction) === null ? null : (
          <div
            className={`flex justify-center items-center gap-1 rounded-full px-2 py-1 ${
              activeTab === 1 ? "bg-red-300" : ""
            }`}
          >
            {countdown(auction) <= 24 ? (
              <div>{countdown(auction)}h</div>
            ) : (
              <div>{Math.floor(countdown(auction) / 24)} days</div>
            )}
            <div className="w-4 h-4">
              <ClockIcon />
            </div>
          </div>
        )}
      </div>
      <div className="text-lg overflow-hidden">
        <p className="truncate">{auction.title}</p>
        <p>...</p>
      </div>
      <div className="font-medium">{auction.start_price} €</div>
      <div className="object-cover w-full h-full rounded-2xl">
        <Image
          width={300}
          height={300}
          src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/files/${auction.image}`}
          alt={auction.title}
          className={`object-cover w-full rounded-2xl ${
            showEditButtons ? "h-36" : "h-40"
          }`}
        />
      </div>
      {showEditButtons && (
        <div className="flex justify-between items-center gap-1">
          <div
            onClick={() => handleDeleteAuction(auction.id)}
            className="cursor-pointer bg-white border border-dark-gray px-2 py-1 rounded-xl"
          >
            <TrashIcon className="w-4 h-4" />
          </div>
          <div
            onClick={handleUpdateAuctionForm}
            className="cursor-pointer flex justify-center items-center gap-1 bg-dark-gray text-white px-2 py-1 rounded-xl w-full"
          >
            <div>
              <PencilIcon className="w-4 h-4" />
            </div>
            <div>Edit</div>
          </div>
        </div>
      )}
      {showAddAuctionsForm && (
        <AddEditAuctionForm
          defaultValues={auction}
          showAddAuctionsForm={showAddAuctionsForm}
          setShowAddAuctionsForm={setShowAddAuctionsForm}
          isUpdateAuction={isUpdateAuction}
        />
      )}
    </div>
  );
};

export default AuctionCard;
