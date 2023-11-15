"use client";

import React, { useEffect, useState } from "react";
import Topbar from "../components/Topbar/Topbar";
import { AuctionType } from "../models/auction";
import AuctionCard from "../components/AuctionCard";
import { useAuctions } from "../hooks/useFetchAuctions";
import AuctionDetails from "../components/AuctionDetails";
import { useFetchUser } from "../hooks/useFetchUser";
import { useFetchBidsByBidderId } from "../hooks/useFetchBidsByBidderId";
import Loading from "../components/Loading";
import NoAuctions from "../components/EmptyStateAuctions/NoAuctions";
import NoMyAuctions from "../components/EmptyStateAuctions/NoMyAuctions";
import NoMyBids from "../components/EmptyStateAuctions/NoMyBids";
import NoWonBids from "../components/EmptyStateAuctions/NoWonBids";

// TODO add error handling

// TODO fetch auctions after updating it
// TODO fetch auctions after deleting it
// TODO fetch auctions after creating it
// TODO fetch auctions on tab change
// TODO fetch bids after placing a bid

// TODO add pagination in dashboard and in auction details bids

const Dashboard = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [activeTopTab, setActiveTopTab] = useState<number | null>(1);
  const [activeTab, setActiveTab] = useState<number | null>(0);
  const [showAuctionDetails, setShowAuctionDetails] = useState(false);
  const [winningBidderId, setWinningBidderId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCurrentUserWinningBidder, setIsCurrentUserWinningBidder] =
    useState<boolean>(false);
  const [selectedAuction, setSelectedAuction] = useState<AuctionType | null>(
    null
  );

  const user = useFetchUser();

  const currentUserId = user?.data.id;

  const auctions = useAuctions(pageNumber, [activeTopTab, activeTab]);

  const myAuctions = auctions.filter(
    (auction) => auction.user.id === currentUserId
  );

  const doneAuctions = auctions.filter(
    (auction) => new Date(auction.end_date) < new Date()
  );

  const currentDate = new Date();

  let uniqueAuctionIds: string[] = [];

  const bids = useFetchBidsByBidderId(currentUserId);
  if (bids && bids.data && Array.isArray(bids.data)) {
    const auctionIds = bids.data.map((bid) => bid.auction_item.id);

    uniqueAuctionIds = Array.from(new Set(auctionIds));
  }

  useEffect(() => {
    if (activeTopTab) {
      setShowAuctionDetails(false);
    }
  }, [activeTopTab]);

  useEffect(() => {
    if (winningBidderId === currentUserId) {
      return setIsCurrentUserWinningBidder(true);
    } else {
      return setIsCurrentUserWinningBidder(false);
    }
  }, [winningBidderId, currentUserId]);

  useEffect(() => {
    if (user && auctions) {
      setIsLoading(false);
    }
  }, [user, auctions]);

  const renderAuctions = (filterFunc: (auction: AuctionType) => boolean) => (
    <div className="w-full flex justify-start items-center">
      <div className="flex flex-wrap justify-start gap-5 w-full">
        {auctions
          .filter(filterFunc)
          .sort(
            (a, b) =>
              new Date(b.end_date).getTime() - new Date(a.end_date).getTime()
          )
          .map((auction: AuctionType, index: number) => (
            <div key={index}>
              <AuctionCard
                isUserBidder={uniqueAuctionIds.includes(auction.id)}
                isCurrentUserWinningBidder={isCurrentUserWinningBidder}
                activeTopTab={activeTopTab}
                setWinningBidderId={setWinningBidderId}
                auction={auction}
                activeTab={activeTab !== null ? activeTab : 0}
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

  return (
    <div className="mx-8 mb-8">
      {isLoading ? (
        <Loading></Loading>
      ) : (
        <>
          <Topbar
            activeTab={activeTab !== null ? activeTab : 0}
            setActiveTab={setActiveTab}
            activeTopTab={activeTopTab !== null ? activeTopTab : 0}
            setActiveTopTab={setActiveTopTab}
            showAuctionDetails={showAuctionDetails}
          />
          {showAuctionDetails && selectedAuction ? (
            <AuctionDetails
              auction={selectedAuction}
              defaultValues={{
                bid: 0,
              }}
            />
          ) : (
            <>
              {activeTopTab === 1 ? (
                auctions.length > 0 ? (
                  renderAuctions(() => true)
                ) : (
                  <NoAuctions />
                )
              ) : activeTopTab === 2 ? (
                <>
                  {activeTab === 0 ? (
                    myAuctions.length > 0 ? (
                      renderAuctions(
                        (auction: AuctionType) =>
                          auction.user.id === currentUserId
                      )
                    ) : (
                      <NoMyAuctions />
                    )
                  ) : activeTab === 1 ? (
                    uniqueAuctionIds.length > 0 ? (
                      renderAuctions(
                        (auction: AuctionType) =>
                          uniqueAuctionIds.includes(auction.id) &&
                          new Date(auction.end_date) > new Date()
                      )
                    ) : (
                      <NoMyBids />
                    )
                  ) : activeTab === 2 ? (
                    uniqueAuctionIds.length > 0 &&
                    isCurrentUserWinningBidder &&
                    doneAuctions ? (
                      renderAuctions(
                        (auction: AuctionType) =>
                          new Date(auction.end_date) < new Date() &&
                          uniqueAuctionIds.includes(auction.id)
                      )
                    ) : (
                      <NoWonBids />
                    )
                  ) : null}
                </>
              ) : null}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
