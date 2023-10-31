"use client";

import React, { useEffect, useState } from "react";
import Topbar from "../components/Topbar";
import { userStorage } from "../utils/localStorage";
import { UserType } from "../models/auth";
import { AuctionType } from "../models/auction";
import Tab from "../components/Tab";
import AuctionCard from "../components/AuctionCard";
import { useAuctions } from "../hooks/useAuction";

const Dashboard = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState(1);

  const handleActiveTab = (index: number) => {
    setActiveTab(index);
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const user = await userStorage.getUser();
        setUser(user);
      } catch (error) {
        console.error("Error retrieving user:", error);
      }
    };

    getUser();
  }, []);

  const auctions = useAuctions(pageNumber);

  return (
    <div>
      <Topbar />
      <div className="flex flex-col px-8 py-4 gap-4">
        <h1 className="font-bold text-4xl">
          Hello {user?.first_name} {user?.last_name} !
        </h1>
        <div className="w-full flex flex-col justify-center items-center">
          <div className="w-fit flex justify-center items-center gap-4 p-1 rounded-2xl bg-gray-blue">
          <Tab active={activeTab === 0} onClick={() => handleActiveTab(0)}>
        My auctions
      </Tab>
          </div>
          <div className="flex w-full justify-start items-start gap-4">
          {auctions.map((auction: AuctionType, index: number) => (
        <AuctionCard key={index} auction={auction} />
      ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
