import React, { useState } from "react";
import Logo from "./Logo";
import HomeIcon from "@heroicons/react/outline/HomeIcon";
import UserIcon from "@heroicons/react/outline/UserIcon";
import UserCircleIcon from "@heroicons/react/outline/UserCircleIcon";
import PlusIcon from "./PlusIcon";
import AddAuctions from "./AddAuction"
import ProfileSettings from "./ProfileSettings";

const Topbar = () => {
  const [activeTab, setActiveTab] = useState<number>(1);
  const [showAddAuctions, setShowAddAuctions] = useState<boolean>(false);
  const [showProfileSettings, setShowProfileSettings] = useState<boolean>(false);

  const handleActiveTab = (index: number) => {
    setActiveTab(index);
  };

  const handleAddAuctionsClick = () => {
    setShowAddAuctions(true);
  };

  const handleUpdateProfile = () => {
    setShowProfileSettings(true);
  }

  return (
    <div className="flex justify-between items-center py-5 px-8">
      <div className="flex items-center w-fit gap-8">
        <Logo />
        <div className="flex gap-1 bg-white rounded-full p-1">
          <div
            className={`flex gap-1 px-3 py-3 rounded-full ${
              activeTab === 1 ? "bg-dark-gray text-white" : ""
            }`}
            onClick={() => handleActiveTab(1)}
          >
            <HomeIcon className="h-5 w-5" />
            <p>Auctions</p>
          </div>
          <div
            className={`flex gap-1 px-3 py-3 rounded-full ${
              activeTab === 2 ? "bg-dark-gray text-white" : ""
            }`}
            onClick={() => handleActiveTab(2)}
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
        <div onClick={handleUpdateProfile} className="p-3 rounded-full bg-gray-blue cursor-pointer">
          <UserCircleIcon className="h-5 w-5" />
        </div>
      </div>
      {showAddAuctions && <AddAuctions/>}
      {showProfileSettings && <ProfileSettings/>}
    </div>
  );
};

export default Topbar;