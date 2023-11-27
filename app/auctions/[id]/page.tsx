"use client";

import ClockIcon from "@heroicons/react/outline/ClockIcon";
import { useState, useRef, useEffect } from "react";
import { Controller } from "react-hook-form";
import Loading from "../components/Loading";
import ToastWarning from "../../components/ToastWarning";
import {
  useCreateUpdateBidFields,
  CreateUpdateBidFields,
} from "../../../src/hooks/useCreateUpdateBid";
import { useFetchBidsByAuctionItemId } from "../../../src/hooks/useFetchBidsByAuctionItemId";
import { useFetchBidsByBidderId } from "../../../src/hooks/useFetchBidsByBidderId";
import { countdown } from "../../../src/utils/countdown";
import Image from "next/image";
import * as API from "../../../src/api/api";
import { useParams } from "next/navigation";
import { StatusCode } from "@/src/constants/errorConstants";
import { AuctionType } from "@/src/models/auction";
import { BidType } from "@/src/models/bid";
import { userStorage } from "@/src/stores/userStorage";
import Topbar from "../components/Topbar";

interface Props {
  defaultValues: BidType;
  auction: AuctionType;
}

const AuctionDetails: React.FC<Props> = () => {
  const [apiError, setApiError] = useState("");
  const [bidStatus, setBidStatus] = useState<string | null>(null);
  const [activeTopTab, setActiveTopTab] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const params = useParams();
  const auctionId: string = params.id;

  const [auction, setAuction] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await API.fetchAuctionById(auctionId);
      setAuction(response.data);
    };
    fetchData();
  }, [auctionId]);

  const user = userStorage.getUser();

  const { bids: auctionBids, refetch } = useFetchBidsByAuctionItemId(auctionId);

  const { handleSubmit, errors, control } = useCreateUpdateBidFields({
    defaultValues: auction?.start_price,
  });

  // Pagination for bids
  const currentPage = useRef(1);
  const pageSize = 9;
  const [paginatedBids, setPaginatedBids] = useState<BidType[]>([]);
  const [trigger, setTrigger] = useState(0);

  useEffect(() => {
    if (auctionBids && auctionBids?.data) {
      const sortedBids = auctionBids?.data.sort((a, b) => b.bid_amount - a.bid_amount);
      const start = (currentPage.current - 1) * pageSize;
      const end = start + pageSize;
      setPaginatedBids(sortedBids.slice(start, end));
    }
  }, [auction?.id, auctionBids, trigger]);

  const totalPages =
    auctionBids && auctionBids?.data ? Math.ceil(auctionBids?.data.length / pageSize) : 0;
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const [highestBid, setHighestBid] = useState(auction?.start_price);

  // Handle add bid
  const handleAddBid = async (data: CreateUpdateBidFields) => {
    const auctionItemId = auction?.id;
    const bidderId = user?.user.id;
    const bidAmount = data.bid_amount;

    const highestBid =
      auctionBids?.data.length > 0
        ? Math.max(
            auction?.start_price,
            ...auctionBids?.data.map((bid: BidType) => bid.bid_amount)
          )
        : auction?.start_price;

    if (bidAmount <= highestBid) {
      setApiError("Your bid must be higher than the current highest bid.");
      return;
    } else {
      setHighestBid(highestBid);
    }

    const response = await API.placeBid(auctionItemId, bidderId, bidAmount);
    if (response.data?.statusCode === StatusCode.BAD_REQUEST) {
      setApiError(response.data.message);
    } else if (response.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR) {
      setApiError(response.data.message);
    } else {
      setBidStatus('Winning');
    }
  };

  // Set highest bid
  useEffect(() => {
    if (auctionBids && auctionBids?.data[0] && Array.isArray(auctionBids?.data)) {
      setHighestBid(
        auctionBids?.data.reduce(
          (max, bid) => Math.max(max, bid.bid_amount),
          auctionBids?.data[0].bid_amount
        )
      );
    }
  }, [auction?.id, auctionBids]);

  const countdownValue = auction ? countdown(auction) : null;

  const currentDate = new Date();

  const auctionDone = new Date(auction?.end_date) < currentDate;

  const {bids:bidsByBidderId, fetchBids} = useFetchBidsByBidderId(user?.user.id);

  // display status of auction
useEffect(() => {
  if (
    bidsByBidderId &&
    bidsByBidderId.data &&
    Array.isArray(bidsByBidderId.data)
  ) {
    const userBidsForThisAuction = bidsByBidderId.data.filter(
      (bid) => bid.auction_item.id === auction?.id
    );

    if (auctionDone) {
      setBidStatus("Done");
    } else if (userBidsForThisAuction.length === 0) {
      setBidStatus("In progress");
    } else {
      setBidStatus(userBidsForThisAuction[0].status);
    }
  }
}, [bidsByBidderId, activeTopTab, activeTab, auctionDone, auction?.id, bidStatus]);

  useEffect(() => {
    if (user && auction) {
      setIsLoading(false);
    }
  }, [user, auction, auctionBids]);

  const onSubmit = handleSubmit(async (data: CreateUpdateBidFields) => {
    await handleAddBid(data);
    refetch();
    fetchBids()
  });

  return (
    <div className="flex flex-col w-full gap-4 px-6">
      <Topbar
        refetchAuctions={refetch}
        activeTab={null}
        activeTopTab={null}
        showAuctionDetails={true}
      />
      {isLoading ? (
        <Loading></Loading>
      ) : (
        <div className="flex gap-4">
          <div className="rounded-2xl w-1/2">
            <Image
              src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/files/${auction?.image}`}
              alt={auction?.title}
              height={1000}
              width={1000}
              className="rounded-2xl object-cover w-full"
            />
          </div>
          <div className="flex flex-col w-1/2 gap-4">
            <div className="flex flex-col bg-white w-full rounded-2xl p-4 gap-4">
              <div className="flex justify-between items-center">
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
              <div className="font-bold text-4xl">{auction?.title}</div>
              <div>{auction?.description}</div>
              <div className="flex gap-10">
                <div className="w-full flex justify-end">
                  <form
                    onSubmit={onSubmit}
                    className="flex gap-4 justify-end items-center">
                    <Controller
                      control={control}
                      name="bid_amount"
                      render={({ field }) => (
                        <div className="flex gap-3 justify-normal items-center">
                          <label htmlFor="bid">Bid:</label>
                          <input
                            {...field}
                            name="bid_amount"
                            id="bid"
                            type="number"
                            aria-label="Bid"
                            aria-describedby="Bid"
                            className="rounded-2xl w-24"
                            onChange={(e) => {
                              field.onChange(e);
                              setHighestBid(Number(e.target.value));
                            }}
                          />
                          <button
                            type="submit"
                            className="px-4 py-2 rounded-full bg-fluoro-yellow cursor-pointer font-medium">
                            Place bid
                          </button>
                        </div>
                      )}
                    />
                  </form>
                </div>
              </div>
            </div>
            <div className="flex flex-col bg-white rounded-2xl p-4 w-full h-full">
              <div className="font-bold text-2xl w-full mb-4">
                Bidding history({auctionBids && auctionBids?.data && auctionBids?.data.length})
              </div>
              {auctionBids && auctionBids?.data && (
                <div>
                  {auctionBids?.data.length !== 0 ? (
                    <div className="w-full flex flex-col">
                      {paginatedBids?.map((bid, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center py-2 border-b border-gray-blue w-full">
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
                              {`${new Date(bid.created_at).toLocaleTimeString(
                                "en-US",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: false,
                                }
                              )} ${new Date(bid.created_at).toLocaleDateString(
                                "de-DE",
                                {
                                  day: "numeric",
                                  month: "numeric",
                                  year: "numeric",
                                }
                              )}`}
                            </div>
                            <div className="rounded-full px-4 py-1 bg-fluoro-yellow w-fit text-center font-medium">
                              {bid.bid_amount} €
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col justify-center items-center">
                      <div className="font-bold text-lg">No bids? yet!</div>
                      <div className="font-light text-gray-500">
                        Place your bid to have a chance to get this item.
                      </div>
                    </div>
                  )}
                </div>
              )}
              {totalPages <= 1 ? null : (
                <div className="flex gap-1 mt-auto justify-center items-center">
                  {pageNumbers.map((pageNumber) => (
                    <button
                      className={`rounded-2xl py-1 px-2 hover:underline ${
                        currentPage.current === pageNumber ? "underline" : ""
                      }`}
                      key={pageNumber}
                      onClick={() => {
                        currentPage.current = pageNumber;
                        setTrigger((prevTrigger) => prevTrigger + 1);
                      }}>
                      {pageNumber}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          {apiError && <ToastWarning errorMessage={apiError} />}
        </div>
      )}
    </div>
  );
};

export default AuctionDetails;