"use client";

import AuctionCard from "@/app/auctions/components/AuctionCard";
import NoWonBids from "@/app/auctions/components/NoWonBids";
import Loading from "@/app/auctions/components/Loading";
import Topbar from "@/app/auctions/components/Topbar";
import { useFetchBidsByBidderId } from "@/src/hooks/useFetchBidsByBidderId";
import { useState, useEffect } from "react";
import { useAuctions } from "../../../src/hooks/useFetchAuctions";
import { AuctionType } from "@/src/models/auction";
import { userStorage } from "@/src/stores/userStorage";

const Bidding = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [activeTopTab, setActiveTopTab] = useState<number | null>(1);
  const [activeTab, setActiveTab] = useState<number | null>(0);
  const [showAuctionDetails, setShowAuctionDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [highestBid, setHighestBid] = useState<number | null>(null);
  const [winningBidderId, setWinningBidderId] = useState<string | null>(null);
  const [isCurrentUserWinningBidder, setIsCurrentUserWinningBidder] =
    useState(false);
  const [selectedAuction, setSelectedAuction] = useState<AuctionType | null>(
    null
  );

  // TODO won auctions dont render properly

  const user = userStorage.getUser();

  const currentUserId = user?.user.id;

  const { auctions, refetch } = useAuctions(pageNumber, [
    activeTopTab,
    activeTab,
  ]);

  const doneAuctions = auctions.filter(
    (auction) => new Date(auction.end_date) < new Date()
  );

  const currentDate = new Date();

  const { bids } = useFetchBidsByBidderId(currentUserId);
  let auctionIdsUserBiddedOn: string[] = [];
  let auctionsUserBiddedOn: AuctionType[] = [];

  if (bids && bids?.data && Array.isArray(bids?.data)) {
    const auctionIds = bids?.data.map((bid) => bid.auction_item.id);
    auctionIdsUserBiddedOn = Array.from(new Set(auctionIds));

    // Filter the auctions that the user has bid on and that have expired
    auctionsUserBiddedOn = auctions.filter(
      (auction) =>
        auctionIdsUserBiddedOn.includes(auction.id) &&
        new Date(auction.end_date) < new Date()
    );
  }

  useEffect(() => {
    if (activeTopTab) {
      setShowAuctionDetails(false);
    }
  }, [activeTopTab]);

  useEffect(() => {
    if (user && auctions) {
      setIsLoading(false);
    }
  }, [user, auctions, bids]);

  useEffect(() => {
    if (winningBidderId?.data === currentUserId) {
      return setIsCurrentUserWinningBidder(true);
    } else {
      return setIsCurrentUserWinningBidder(false);
    }
  }, [winningBidderId, currentUserId]);

  const renderAuctions = (filterFunc: (auction: AuctionType) => boolean) => (
    <div className="w-full flex justify-start items-center">
      <div className="flex flex-wrap justify-start gap-5 w-screen mb-5">
        {auctions
          .filter(filterFunc)
          .sort((a, b) => {
            const aEndDate = new Date(a.end_date);
            const bEndDate = new Date(b.end_date);
            const currentDate = new Date();

            // Check if either auction has ended
            const aEnded = aEndDate <= currentDate;
            const bEnded = bEndDate <= currentDate;

            if (aEnded && !bEnded) {
              // If a has ended but b hasn't, a should come after b
              return 1;
            } else if (!aEnded && bEnded) {
              // If b has ended but a hasn't, a should come before b
              return -1;
            } else {
              // If both have ended or both haven't ended, sort by end date
              return aEndDate.getTime() - bEndDate.getTime();
            }
          })
          .map((auction: AuctionType, index: number) => (
            <div key={index}>
              <AuctionCard
                setWinningBidderId={setWinningBidderId}
                refetchAuctions={refetch}
                activeTopTab={2}
                auction={auction}
                activeTab={2}
                onClick={() => {
                  if (
                    (activeTopTab === 1 ||
                      (activeTopTab === 2 && activeTab === 1)) &&
                    new Date(auction.end_date) > currentDate
                  ) {
                    setSelectedAuction(auction);
                    setShowAuctionDetails(true);
                    setActiveTab(null);
                    setActiveTopTab(null);
                  }
                }}
              />
            </div>
          ))}
      </div>
    </div>
  );

  // set highest bid for each auction
  useEffect(() => {
    if (bids && Array.isArray(bids.data)) {
      setHighestBid(
        bids.data.reduce(
          (max, bid) => Math.max(max, bid.bid_amount),
          bids.data[0].bid_amount
        )
      );
    }
  }, [bids]);

  console.log("auctionsUserBiddedOn", auctionsUserBiddedOn);
  console.log("doneAuctions", doneAuctions);
  console.log("winningBidderId", winningBidderId);
  console.log('isCurrentUserWinningBidder', isCurrentUserWinningBidder)

  return (
    <div className="px-6">
      {isLoading ? (
        <Loading></Loading>
      ) : (
        <>
          <Topbar
            refetchAuctions={refetch}
            activeTab={2}
            activeTopTab={2}
            showAuctionDetails={showAuctionDetails}
          />
          {auctionsUserBiddedOn.length > 0 &&
          doneAuctions.length > 0 &&
          isCurrentUserWinningBidder ? (
            renderAuctions(
              (auction: AuctionType) => new Date(auction.end_date) < new Date()
            )
          ) : (
            <NoWonBids />
          )}
        </>
      )}
    </div>
  );
};

export default Bidding;
