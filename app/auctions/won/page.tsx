"use client";

import AuctionCard from "@/app/auctions/components/AuctionCard";
import NoWonBids from "@/app/auctions/components/NoWonBids";
import Loading from "@/app/auctions/components/Loading";
import Topbar from "@/app/auctions/components/Topbar";
import { useState, useEffect } from "react";
import { AuctionType } from "@/src/models/auction";
import { userStorage } from "@/src/stores/userStorage";
import { useFetchWon } from "@/src/hooks/useFetchWon";
import { DashboardLayout } from "../DashboardLayout";

const Won = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [activeTopTab, setActiveTopTab] = useState<number | null>(1);
  const [activeTab, setActiveTab] = useState<number | null>(0);
  const [showAuctionDetails, setShowAuctionDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const user = userStorage.getUser();

  const { auctions, refetch } = useFetchWon(user?.id);

  useEffect(() => {
    if (activeTopTab) {
      setShowAuctionDetails(false);
    }
  }, [activeTopTab]);

  useEffect(() => {
    if (user && auctions) {
      setIsLoading(false);
    }
  }, [user, auctions]);

  const renderAuctions = (filterFunc: (auction: AuctionType) => boolean) => (
    <div className="w-full flex justify-start items-center">
      <div className="flex flex-wrap justify-start gap-5 w-screen mb-5">
        {auctions
          .map((auction: AuctionType, index: number) => (
            <div key={index} className="w-full lg:w-fit">
              <AuctionCard
                refetchAuctions={refetch}
                activeTopTab={2}
                auction={auction}
                activeTab={2}
                onClick={() => {
                  if (
                    (activeTopTab === 1 ||
                      (activeTopTab === 2 && activeTab === 1))
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
            activeTab={2}
            activeTopTab={2}
            showAuctionDetails={showAuctionDetails}
          />
          {auctions.length > 0 ? (
            renderAuctions(
              (auction: AuctionType) => new Date(auction.end_date) < new Date()
            )
          ) : (
            <NoWonBids />
          )}
        </>
      )}
    </DashboardLayout>
  );
};

export default Won;
