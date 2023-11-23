import React, { FC, useEffect, useState } from "react";
import Image from "next/image";
import TrashIcon from "@heroicons/react/outline/TrashIcon";
import PencilIcon from "@heroicons/react/outline/PencilIcon";
import ClockIcon from "@heroicons/react/outline/ClockIcon";
import AddEditAuctionForm from "./AddEditAuctionForm";
import * as API from "../../../src/api/api";
import { countdown } from "../../../src/utils/countdown";
import { useFetchBidsByAuctionItemId } from "../../../src/hooks/useFetchBidsByAuctionItemId";
import { useFetchBidsByBidderId } from "../../../src/hooks/useFetchBidsByBidderId";
import Link from "next/link";
import { AuctionType } from "@/src/models/auction";
import { userStorage } from "@/src/stores/userStorage";

interface Props {
  refetchAuctions: () => void;
  activeTopTab: number | null;
  auction: AuctionType;
  activeTab: number;
  onClick?: () => void;
}

const AuctionCard: FC<Props> = ({
  refetchAuctions,
  activeTopTab,
  auction,
  activeTab,
  onClick,
}) => {
  const [showAddAuctionsForm, setShowAddAuctionsForm] = useState(false);
  const [isUpdateAuction, setIsUpdateAuction] = useState(true);
  const [showEditButtons, setShowEditButtons] = useState(false);
  const [highestBid, setHighestBid] = useState<number | null>(null);
  const [bidStatus, setBidStatus] = useState<string | null>(null);

  const user = userStorage.getUser();

  const currentDate = new Date();

  const auctionInProgress = new Date(auction.end_date) >= currentDate;
  const auctionDone = new Date(auction.end_date) < currentDate;

  const handleUpdateAuctionForm = () => {
    setShowAddAuctionsForm(true);
  };

  const countdownValue = countdown(auction);

  const { bids } = useFetchBidsByAuctionItemId(auction.id);

  const bidsByBidderId = useFetchBidsByBidderId(user.user.id);

  // display status of auction
  useEffect(() => {
    if (
      bidsByBidderId &&
      bidsByBidderId.data &&
      Array.isArray(bidsByBidderId.data)
    ) {
      const userBidsForThisAuction = bidsByBidderId.data.filter(
        (bid) => bid.auction_item.id === auction.id
      );

      if (auctionDone) {
        setBidStatus("Done");
      } else if (userBidsForThisAuction.length === 0) {
        setBidStatus("In progress");
      } else {
        setBidStatus(
          userBidsForThisAuction[userBidsForThisAuction.length - 1].status
        );
      }

      if (activeTopTab === 2 && activeTab === 0) {
        if (auctionInProgress) {
          setBidStatus("In progress");
        } else {
          setBidStatus("Done");
        }
      }
    }
  }, [bidsByBidderId, activeTopTab, activeTab, auctionDone, auctionInProgress]);

  // set highest bid to display item price in card
  useEffect(() => {
    if (bids && bids.data[0] && Array.isArray(bids.data)) {
      setHighestBid(
        bids.data.reduce(
          (max, bid) => Math.max(max, bid.bid_amount),
          bids.data[0].bid_amount
        )
      );
    }
  }, [auction.id, bids]);

  // handle delete auction
  const handleDeleteAuction = async (id: string) => {
    try {
      await API.deleteAuction(id);
      refetchAuctions();
    } catch (error) {
      console.error("Failed to delete auction:", error);
    }
  };

  useEffect(() => {
    if (activeTopTab === 2 && activeTab === 0 && auctionInProgress) {
      setShowEditButtons(true);
    } else if (activeTopTab === 1 || activeTab === 1) {
      setShowEditButtons(false);
    } else {
      setShowEditButtons(false);
    }
  }, [activeTab, activeTopTab, auctionInProgress]);

  return (
    <Link href={`/auctions/${auction.id}`}>
      <div
        onClick={onClick}
        className="flex flex-col bg-white w-56 h-72 rounded-2xl p-3 font-light gap-1 hover:brightness-90">
        <div className="flex justify-between text-xs">
          <div
            className={`rounded-full px-2 py-1 ${
              bidStatus === "In progress"
                ? "bg-fluoro-yellow-light"
                : bidStatus === "Winning"
                ? "bg-fluoro-green"
                : bidStatus === "Outbid"
                ? "bg-red-300"
                : "bg-dark-gray text-white"
            }`}>
            {bidStatus}
          </div>
          {countdownValue === null ? null : (
            <div
              className={`flex justify-center items-center gap-1 rounded-full px-2 py-1 ${
                countdownValue <= 24 ? "bg-red-300" : ""
              }`}>
              {countdownValue <= 24 ? (
                <div>{countdownValue}h</div>
              ) : (
                <div>{Math.floor(countdownValue / 24)} days</div>
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
        <div className="font-medium">
          {highestBid ? highestBid : auction.start_price} €
        </div>
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
              className="cursor-pointer bg-white border border-dark-gray px-2 py-1 rounded-xl">
              <TrashIcon className="w-4 h-4" />
            </div>
            <div
              onClick={handleUpdateAuctionForm}
              className="cursor-pointer flex justify-center items-center gap-1 bg-dark-gray text-white px-2 py-1 rounded-xl w-full">
              <div>
                <PencilIcon className="w-4 h-4" />
              </div>
              <div>Edit</div>
            </div>
          </div>
        )}
        {showAddAuctionsForm && (
          <AddEditAuctionForm
            refetchAuctions={refetchAuctions}
            defaultValues={auction}
            setShowAddAuctionsForm={setShowAddAuctionsForm}
            isUpdateAuction={isUpdateAuction}
          />
        )}
      </div>
    </Link>
  );
};

export default AuctionCard;
