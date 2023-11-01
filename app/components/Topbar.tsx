import React, { FC, useEffect, useState } from "react";
import Logo from "./Logo";
import HomeIcon from "@heroicons/react/outline/HomeIcon";
import UserIcon from "@heroicons/react/outline/UserIcon";
import UserCircleIcon from "@heroicons/react/outline/UserCircleIcon";
import PlusIcon from "./PlusIcon";
import AddAuctions from "./AddAuction";
import ProfileSettings from "./ProfileSettings";
import { userStorage } from "../utils/localStorage";
import { UserType } from "../models/auth";
import Tab from "./Tab";

interface Props {
  activeTab: number;
  setActiveTab: (index: number) => void;
  activeTopTab: number;
  setActiveTopTab: (index: number) => void;
}

const Topbar: FC<Props> = ({
  activeTab,
  setActiveTab,
  activeTopTab,
  setActiveTopTab,
}) => {
  const [showAddAuctions, setShowAddAuctions] = useState<boolean>(false);
  const [showProfileSettings, setShowProfileSettings] =
    useState<boolean>(false);
  const [user, setUser] = useState<UserType | null>(null);

  const handleActiveTopTab = (index: number) => {
    setActiveTopTab(index);
  };

  const handleActiveTab = (index: number) => {
    setActiveTab(index);
  };

  const handleAddAuctionsClick = () => {
    setShowAddAuctions(true);
  };

  const handleUpdateProfile = () => {
    setShowProfileSettings(true);
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
    <div className="flex flex-col pt-8">
      <div className="flex items-center">
        <div className="flex justify-between items-center w-screen">
          <div className="flex gap-6">
            <Logo />
            <div className="flex gap-1 bg-white rounded-full p-1">
              <div
                className={`flex gap-1 px-3 py-3 rounded-full ${
                  activeTopTab === 1 ? "bg-dark-gray text-white" : ""
                }`}
                onClick={() => handleActiveTopTab(1)}
              >
                <HomeIcon className="h-5 w-5" />
                <p>Auctions</p>
              </div>
              <div
                className={`flex gap-1 px-3 py-3 rounded-full ${
                  activeTopTab === 2 ? "bg-dark-gray text-white" : ""
                }`}
                onClick={() => handleActiveTopTab(2)}
              >
                <UserIcon className="h-5 w-5" />
                <p>Profile</p>
              </div>
            </div>
          </div>

          <div className="flex gap-1 bg-white rounded-full justify-center items-center p-1">
            <div
              className="p-3 rounded-full bg-fluoro-yellow cursor-pointer"
              onClick={handleAddAuctionsClick}
            >
              <PlusIcon />
            </div>
            <div
              onClick={handleUpdateProfile}
              className="p-3 rounded-full bg-gray-blue cursor-pointer"
            >
              <UserCircleIcon className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col py-4 gap-4 w-full mt-4">
        {activeTopTab === 1 && (
          <div className="font-bold text-4xl">Auctions</div>
        )}
        {activeTopTab === 2 && (
          <div>
            <h1 className="font-bold text-4xl">
              Hello {user?.user.first_name} {user?.user.last_name} !
            </h1>
            <div className="w-full flex flex-col justify-center items-center">
              <div className="w-fit flex justify-center items-center gap-2 p-1 rounded-2xl bg-gray-blue">
                <Tab
                  active={activeTab === 0}
                  onClick={() => handleActiveTab(0)}
                >
                  My auctions
                </Tab>
                <Tab
                  active={activeTab === 1}
                  onClick={() => handleActiveTab(1)}
                >
                  Bidding
                </Tab>
                <Tab
                  active={activeTab === 2}
                  onClick={() => handleActiveTab(2)}
                >
                  Won
                </Tab>
              </div>
            </div>
          </div>
        )}
      </div>
      {showAddAuctions && (
        <AddAuctions
          showAddAuctions={showAddAuctions}
          setShowAddAuctions={setShowAddAuctions}
        />
      )}
      {showProfileSettings && (
        <ProfileSettings
          showProfileSettings={showProfileSettings}
          setShowProfileSettings={setShowProfileSettings}
        />
      )}
    </div>
  );
};

export default Topbar;
