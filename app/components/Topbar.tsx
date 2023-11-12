import React, { FC, useEffect, useState } from "react";
import Logo from "./Logo";
import HomeIcon from "@heroicons/react/outline/HomeIcon";
import UserIcon from "@heroicons/react/outline/UserIcon";
import UserCircleIcon from "@heroicons/react/outline/UserCircleIcon";
import PlusIcon from "./PlusIcon";
import AddAuctionsForm from "./AddEditAuctionForm";
import ProfileSettingsLogout from "./ProfileSettingsLogout";
import { UserType } from "../models/auth";
import Tab from "./Tab";
import Image from "next/image";
import { useFetchUser } from "../hooks/useFetchUser";

interface Props {
  activeTab: number;
  setActiveTab: (index: number) => void;
  activeTopTab: number;
  setActiveTopTab: (index: number) => void;
  showAuctionDetails: boolean;
}

const Topbar: FC<Props> = ({
  activeTab,
  setActiveTab,
  activeTopTab,
  setActiveTopTab,
  showAuctionDetails,
}) => {
  const [showAddAuctionsForm, setShowAddAuctionsForm] =
    useState<boolean>(false);
  const [showProfileSettings, setShowProfileSettings] =
    useState<boolean>(false);

  const handleActiveTopTab = (index: number) => {
    setActiveTopTab(index);
  };

  const handleActiveTab = (index: number) => {
    setActiveTab(index);
  };

  const handleAddAuctionsClick = () => {
    setShowAddAuctionsForm(true);
  };

  const handleUpdateProfile = () => {
    setShowProfileSettings(true);
  };

  const user = useFetchUser();

  return (
    <div className="flex flex-col pt-8">
      <div className="flex items-center">
        <div className="flex justify-between items-center w-screen">
          <div className="flex gap-6">
            <Logo />
            <div className="flex gap-1 bg-white rounded-full p-1">
              <div
                className={`flex gap-1 px-3 py-3 rounded-full cursor-pointer ${
                  activeTopTab === 1 ? "bg-dark-gray text-white" : ""
                }`}
                onClick={() => handleActiveTopTab(1)}
              >
                <HomeIcon className="h-5 w-5" />
                <p>Auctions</p>
              </div>
              <div
                className={`flex gap-1 px-3 py-3 rounded-full cursor-pointer ${
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
              className="rounded-full cursor-pointer"
            >
              {user?.data.avatar ? (
                <Image
                  alt="avatar"
                  src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/files/${user.data.avatar}`}
                  width={50}
                  height={50}
                  className="rounded-full"
                />
              ) : (
                <div className="p-3 bg-gray-blue rounded-full">
                  <UserCircleIcon className="h-5 w-5" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {!showAuctionDetails && (
        <div className="flex flex-col py-4 gap-4 w-full mt-4">
          {activeTopTab === 1 && (
            <div className="font-bold text-4xl">Auctions</div>
          )}
          {activeTopTab === 2 && (
            <div>
              <h1 className="font-bold text-4xl">
                Hello {user?.data.first_name} {user?.data.last_name} !
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
      )}

      {showAddAuctionsForm && (
        <AddAuctionsForm
          showAddAuctionsForm={showAddAuctionsForm}
          setShowAddAuctionsForm={setShowAddAuctionsForm}
          isUpdateAuction={false}
        />
      )}
      {showProfileSettings && (
        <ProfileSettingsLogout
          showProfileSettings={showProfileSettings}
          setShowProfileSettings={setShowProfileSettings}
        />
      )}
    </div>
  );
};

export default Topbar;
