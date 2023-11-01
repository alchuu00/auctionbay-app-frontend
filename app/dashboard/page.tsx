"use client";

import React, { useState } from "react";
import Topbar from "../components/Topbar";
import { AuctionType } from "../models/auction";
import AuctionCard from "../components/AuctionCard";
import { useAuctions } from "../hooks/useAuction";
import authStore from "../stores/authStore";

const Dashboard = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [activeTopTab, setActiveTopTab] = useState<number>(1);
  const [activeTab, setActiveTab] = useState(0);

  const currentUserId = authStore.userId;

  const auctions = useAuctions(pageNumber);

  const currentDate = new Date();

  const renderAuctions = (filterFunc: (auction: AuctionType) => boolean) => (
    <div className="w-full flex justify-start items-center">
      <div className="flex flex-wrap justify-start gap-5">
        {auctions
          .filter(filterFunc)
          .sort(
            (a, b) =>
              new Date(b.end_date).getTime() - new Date(a.end_date).getTime()
          )
          .map((auction: AuctionType, index: number) => {
            return (
              <div key={index}>
                <AuctionCard auction={auction} activeTab={activeTab} />
              </div>
            );
          })}
      </div>
    </div>
  );

  return (
    <div className="mx-8 mb-8">
      <Topbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeTopTab={activeTopTab}
        setActiveTopTab={setActiveTopTab}
      />
      {activeTopTab === 1 && renderAuctions(() => true)}
      {activeTopTab === 2 && (
        <>
          {activeTab === 0 &&
            renderAuctions(
              (auction: AuctionType) => auction.user.id === currentUserId
            )}
          {activeTab === 1 &&
            renderAuctions(
              (auction: AuctionType) =>
                new Date(auction.end_date) > currentDate &&
                auction.user.id === currentUserId
            )}
          {activeTab === 2 &&
            renderAuctions(
              (auction: AuctionType) =>
                new Date(auction.end_date) < currentDate &&
                auction.user.id === currentUserId
            )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
