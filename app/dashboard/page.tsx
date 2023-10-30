"use client";

import React, { useEffect, useState } from "react";
import Topbar from "../components/Topbar";
import { userStorage } from "../utils/localStorage";
import { UserType } from "../models/auth";
import * as API from "../api/api";
import { AuctionType } from "../models/auction";
import Image from "next/image";

const Dashboard = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [auctions, setAuctions] = useState<AuctionType[]>([]);

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

  useEffect(() => {
    async function fetchData() {
      const data = await API.fetchAuctions(pageNumber);
      setAuctions(data.data.data);
    }
    fetchData();
  }, [pageNumber]);

  return (
    <div>
      <Topbar />
      <div className="flex flex-col px-8 py-4 gap-4">
        <h1 className="font-bold text-4xl">
          Hello {user?.first_name} {user?.last_name} !
        </h1>
        <div className="w-full flex flex-col justify-center items-center">
          <div className="w-fit flex justify-center items-center gap-4 p-1 rounded-2xl bg-gray-blue">
            <div
              className={`text-center gap-1 px-3 py-2 rounded-2xl w-32 cursor-pointer ${
                activeTab === 0 ? "bg-dark-gray text-white" : ""
              }`}
              onClick={() => handleActiveTab(0)}
            >
              My auctions
            </div>
            <div
              className={`text-center gap-1 px-3 py-2 rounded-2xl w-32 cursor-pointer ${
                activeTab === 1 ? "bg-dark-gray text-white" : ""
              }`}
              onClick={() => handleActiveTab(1)}
            >
              Bidding
            </div>
            <div
              className={`text-center gap-1 px-3 py-2 rounded-2xl w-32 cursor-pointer ${
                activeTab === 2 ? "bg-dark-gray text-white" : ""
              }`}
              onClick={() => handleActiveTab(2)}
            >
              Won
            </div>
          </div>
          <div className="flex w-full justify-start items-start gap-4">
            {auctions.map((auction: AuctionType, index: number) => (
              <div key={index} className="bg-white w-52 h-60 rounded-2xl">
                <h2>{auction.title}</h2>
                <p>{auction.start_price} €</p>
                <Image
                          width={100}
                          height={100}
                          src={`http://localhost:8080/files/${auction.image}`}
                          alt={auction.title}
                        />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
