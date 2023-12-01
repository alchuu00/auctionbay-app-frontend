"use client";

import AuctionCard from "@/app/auctions/components/AuctionCard";
import NoAuctions from "@/app/auctions/components/NoAuctions";
import Loading from "@/app/auctions/components/Loading";
import Topbar from "@/app/auctions/components/Topbar";
import { useAuctions } from "@/src/hooks/useFetchAuctions";
import { useFetchBidsByBidderId } from "@/src/hooks/useFetchBidsByBidderId";
import { AuctionType } from "@/src/models/auction";
import { userStorage } from "@/src/stores/userStorage";
import { useState, useEffect } from "react";
import { DashboardLayout } from "../DashboardLayout";

const All = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [activeTopTab, setActiveTopTab] = useState<number | null>(1);
  const [activeTab, setActiveTab] = useState<number | null>(0);
  const [showAuctionDetails, setShowAuctionDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [highestBid, setHighestBid] = useState<number | null>(null);

  // TODO add dashboard cards: earnings, posted auctions, currently bidding, currently winning
  // TODO add toast notifications for when auction is created, deleted, updated
  // TODO add toast notifications for when user details are updated
  // TODO add a notifications container that shows bid status updates and auction expired notifications

  // TODO responsive design: you set lg breakpoints first 

  const user = userStorage.getUser();

  const currentUserId = user?.user.id;

  const { auctions, refetch } = useAuctions(pageNumber, [
    activeTopTab,
    activeTab,
  ]);

  const currentDate = new Date();

  let auctionIdsUserBiddedOn: string[] = [];

  const { bids } = useFetchBidsByBidderId(currentUserId);
  if (bids) {
    const auctionIds = bids?.map((bid) => bid.auction_item.id);

    auctionIdsUserBiddedOn = Array.from(new Set(auctionIds));
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
    if (typeof refetch === "function") {
      refetch();
    }
  }, [activeTab, activeTopTab]);

  const renderAuctions = (filterFunc: (auction: AuctionType) => boolean) => (
    <div className="w-full flex justify-center items-center">
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
            <div key={index} className="w-full lg:w-fit">
              <AuctionCard
                refetchAuctions={refetch}
                activeTopTab={1}
                auction={auction}
                activeTab={0}
                onClick={() => {
                  if (
                    (activeTopTab === 1 ||
                      (activeTopTab === 2 && activeTab === 1)) &&
                    new Date(auction.end_date) > currentDate
                  ) {
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
    if (bids && bids[0]) {
      setHighestBid(
        bids.reduce(
          (max, bid) => Math.max(max, bid.bid_amount),
          bids[0].bid_amount
        )
      );
    }
  }, [bids]);

  return (
    <DashboardLayout>
      {isLoading ? (
        <Loading></Loading>
      ) : (
        <>
          <Topbar
            refetchAuctions={refetch}
            activeTab={activeTab !== null ? activeTab : 0}
            activeTopTab={activeTopTab !== null ? activeTopTab : 0}
            showAuctionDetails={showAuctionDetails}
          />
          {auctions.length > 0 ? renderAuctions(() => true) : <NoAuctions />}
        </>
      )}
    </DashboardLayout>
  );
};

export default All;
