"use client";

import React, { useEffect, useState } from "react";
import Topbar from "../components/Topbar";
import { userStorage } from "../utils/localStorage";
import { UserType } from "../models/auth";

const Dashboard = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [activeTab, setActiveTab] = useState<number>(0);

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

  return (
    <div>
      <Topbar />
      <div className="flex flex-col px-8 py-4 gap-4">
        <h1 className="font-bold text-4xl">
          Hello {user?.first_name} {user?.last_name} !
        </h1>
        <div className="w-full flex justify-center items-center">
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
        </div>
        <div className="bg-white w-52 h-60 rounded-2xl">Auctions</div>
      </div>
    </div>
  );
};

export default Dashboard;
