"use client";

import AuctionCard from "@/app/auctions/components/AuctionCard";
import Loading from "@/app/auctions/components/Loading";
import Topbar from "@/app/auctions/components/Topbar";
import { useFetchBidsByBidderId } from "@/src/hooks/useFetchBidsByBidderId";
import { useState, useEffect } from "react";
import { useAuctions } from "../../../src/hooks/useFetchAuctions";
import { AuctionType } from "@/src/models/auction";
import { userStorage } from "@/src/stores/userStorage";
import NoMyBids from "../components/NoMyBids";
import { DashboardLayout } from "../DashboardLayout";

const Bidding = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [activeTopTab, setActiveTopTab] = useState<number | null>(1);
  const [activeTab, setActiveTab] = useState<number | null>(0);
  const [showAuctionDetails, setShowAuctionDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const user = userStorage.getUser();

  const currentUserId = user?.id;

  const { auctions, refetch } = useAuctions(pageNumber, [
    activeTopTab,
    activeTab,
  ]);

  const currentDate = new Date();

  let auctionIdsUserBiddedOn: string[] = [];

  const {bids} = useFetchBidsByBidderId(currentUserId);
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
            <div key={index} className="w-full lg:w-fit">
              <AuctionCard
                refetchAuctions={refetch}
                activeTopTab={2}
                auction={auction}
                activeTab={1}
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

  return (
    <DashboardLayout>
      {isLoading ? (
        <Loading></Loading>
      ) : (
        <>
          <Topbar
            refetchAuctions={refetch}
            activeTab={1}
            activeTopTab={2}
            showAuctionDetails={showAuctionDetails}
          />
          {auctionIdsUserBiddedOn.length > 0 &&
          auctions.some(
            (auction: AuctionType) =>
              auctionIdsUserBiddedOn.includes(auction.id) &&
              new Date(auction.end_date) > new Date()
          ) ? (
            renderAuctions(
              (auction: AuctionType) =>
                auctionIdsUserBiddedOn.includes(auction.id) &&
                new Date(auction.end_date) > new Date()
            )
          ) : (
            <NoMyBids />
          )}
        </>
      )}
    </DashboardLayout>
  );
};

export default Bidding;
