import React, { useEffect, useState } from "react";
import Image from "next/image";
import { AuctionType } from "../models/auction";
import { countdown } from "../utils/countdown";
import ClockIcon from "@heroicons/react/outline/ClockIcon";
import {
  CreateUpdateBidFields,
  useCreateUpdateBidFields,
} from "../hooks/useCreateUpdateBid";
import { BidType } from "../models/bid";
import * as API from "../api/api";
import { StatusCode } from "../constants/errorConstants";
import ToastWarning from "./ToastWarning";
import { Controller } from "react-hook-form";
import { useFetchUser } from "../hooks/useFetchUser";
import { useFetchBids } from "../hooks/useFetchBids";

interface Props {
  auction: AuctionType;
  defaultValues: BidType;
}

// TODO show auction status

const AuctionDetails: React.FC<Props> = ({ auction, defaultValues }) => {
  const [apiError, setApiError] = useState("");
  const [showError, setShowError] = useState(false);
  const [bid, setBid] = useState(0);
  const { handleSubmit, errors, control } = useCreateUpdateBidFields({
    defaultValues,
  });

  const user = useFetchUser();

  const handleAddBid = async (bidAmount: CreateUpdateBidFields) => {
    const auctionItemId = auction.id;
    const bidderId = user?.data.id;
    const bidValue = bidAmount.bid;

    const highestBid =
      bids.data.length > 0
        ? Math.max(
            auction.start_price,
            ...bids.data.map((bid) => bid.bid_amount)
          )
        : auction.start_price;

    if (bidValue <= highestBid) {
      setApiError("Your bid must be higher than the current highest bid.");
      setShowError(true);
      return;
    }

    const response = await API.placeBid(auctionItemId, bidderId, bidValue);
    if (response.data?.statusCode === StatusCode.BAD_REQUEST) {
      setApiError(response.data.message);
      setShowError(true);
    } else {
      setApiError(response.data.message);
      setShowError(true);
    }
  };

  const onSubmit = handleSubmit(async (data: CreateUpdateBidFields) => {
    await handleAddBid(data);
  });

  const bids: BidType[] = useFetchBids(auction.id);

  return (
    <div className="flex w-full gap-4 py-4">
      <div className="rounded-2xl w-1/2">
        <Image
          src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/files/${auction.image}`}
          alt={auction.title}
          height={1000}
          width={1000}
          className="rounded-2xl object-cover w-full"
        />
      </div>
      <div className="flex flex-col w-1/2 gap-4">
        <div className="flex flex-col bg-white w-full rounded-2xl p-4 gap-4">
          <div className="flex justify-between items-center">
            <div> Auction Status</div>
            {countdown(auction) === null ? null : (
              <div className="flex justify-center items-center gap-1 rounded-full px-2 py-1 bg-red-300">
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
          <div className="font-bold text-4xl">{auction.title}</div>
          <div>{auction.description}</div>
          <div className="flex gap-10">
            <div className="w-full flex justify-end">
              <form
                onSubmit={onSubmit}
                className="flex gap-4 justify-end items-center"
              >
                <Controller
                  control={control}
                  name="bid"
                  render={({ field }) => (
                    <div className="flex gap-3 justify-normal items-center">
                      <label htmlFor="bid">Bid:</label>
                      <input
                        {...field}
                        name="bid"
                        id="bid"
                        type="number"
                        aria-label="Bid"
                        aria-describedby="Bid"
                        className="rounded-2xl w-24"
                        onChange={(e) => {
                          field.onChange(e);
                          setBid(Number(e.target.value));
                        }}
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-full bg-fluoro-yellow cursor-pointer"
                      >
                        Place bid
                      </button>
                    </div>
                  )}
                />
              </form>
            </div>
          </div>
        </div>
        <div className="flex flex-col bg-white rounded-2xl p-4 w-full">
          <div className="font-bold text-2xl w-full mb-4">
            Bidding history({bids && bids.data && bids.data.length + 1})
          </div>
          <div className="w-full flex flex-col">
            {bids &&
              bids.data.map((bid, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-2 border-b border-gray-blue w-full"
                >
                  <div className="flex justify-start items-center gap-3 w-full">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/files/${bid.bidder.avatar}`}
                      className="rounded-full"
                      alt=""
                      height={30}
                      width={30}
                    />
                    <div>
                      {bid.bidder.first_name} {bid.bidder.last_name}
                    </div>
                  </div>
                  <div className="flex justify-end items-center text-right w-full gap-5">
                    <div className="text-right">
                      {`${new Date(bid.created_at).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })} ${new Date(bid.created_at).toLocaleDateString(
                        "de-DE",
                        {
                          day: "numeric",
                          month: "numeric",
                          year: "numeric",
                        }
                      )}`}
                    </div>
                    <div className="rounded-full px-4 py-1 bg-fluoro-yellow w-fit text-center">
                      {bid.bid_amount} €
                    </div>
                  </div>
                </div>
              ))}
            <div className="flex justify-between items-center py-2 border-b border-gray-blue w-full">
              <div className="flex justify-start items-center gap-3 w-full">
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/files/${auction.user.avatar}`}
                  className="rounded-full"
                  alt=""
                  height={30}
                  width={30}
                />
                <div>
                  {auction.user.first_name} {auction.user.last_name}
                </div>
              </div>
              <div className="flex justify-end items-center text-right w-full gap-5">
                <div className="text-right">
                  {`${new Date(auction.created_at).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })} ${new Date(auction.created_at).toLocaleDateString(
                    "de-DE",
                    {
                      day: "numeric",
                      month: "numeric",
                      year: "numeric",
                    }
                  )}`}
                </div>
                <div className="rounded-full px-4 py-1 bg-fluoro-yellow w-fit text-center">
                  {auction.start_price} €
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {apiError && (
        <ToastWarning errorMessage={apiError} showErrorMessage={showError} />
      )}
    </div>
  );
};

export default AuctionDetails;
