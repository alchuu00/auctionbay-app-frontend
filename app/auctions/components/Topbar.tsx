import React, { FC, useEffect, useState } from "react";
import HomeIcon from "@heroicons/react/outline/HomeIcon";
import UserIcon from "@heroicons/react/outline/UserIcon";
import UserCircleIcon from "@heroicons/react/outline/UserCircleIcon";
import PlusIcon from "./PlusIcon";
import AddAuctionsForm from "./AddEditAuctionForm";
import ProfileSettingsLogout from "./ProfileSettingsLogout";
import Tab from "./Tab";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Logo from "@/app/components/Logo";
import { userStorage } from "@/src/stores/userStorage";
import { useFetchAuctionsByUserId } from "@/src/hooks/useFetchAuctionsByUserId";
import { useFetchAuctionBiddedOnByUserId } from "@/src/hooks/useFetchAuctionsBiddedonByUserId";
import { useFetchWinning } from "@/src/hooks/useFetchWinning";
import { useFetchWon } from "@/src/hooks/useFetchWon";
import { calculateEarnings } from "@/src/utils/calculateEarnings";
import BellIcon from "./BellIcon";
import NotificationsPopup from "./NotificationsPopup";
import { useFetchNotifications } from "@/src/hooks/useFetchSSENotifications";
import { NotificationType } from "@/src/models/notification";
import { routes } from "@/src/constants/routesConstants";
import { UserType } from "@/src/models/auth";

interface Props {
  refetchAuctions: () => void;
  activeTab: number | null;
  activeTopTab: number | null;
  showAuctionDetails: boolean;
}

const Topbar: FC<Props> = ({
  refetchAuctions,
  activeTab,
  activeTopTab,
  showAuctionDetails,
}) => {
  const [showAddAuctionsForm, setShowAddAuctionsForm] =
    useState<boolean>(false);
  const [showProfileSettings, setShowProfileSettings] =
    useState<boolean>(false);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [notificationsToShow, setNotificationsToShow] = useState<
    NotificationType[]
  >([]);
  const handleAddAuctionsClick = () => {
    setShowAddAuctionsForm(true);
  };

  const handleUpdateProfile = () => {
    setShowProfileSettings(true);
  };

  const handleShowNotifications = () => {
    if (showNotifications) {
      setShowNotifications(false);
      return;
    } else {
      setShowNotifications(true);
    }
  };

  const router = useRouter();

  const user = userStorage.getUser();

  const { auctions } = useFetchAuctionsByUserId(user?.id);

  const fetchedNotifications = useFetchNotifications();

  useEffect(() => {
    const clearedNotifications = localStorage.getItem("clearedNotifications");
    const clearedNotificationsArray = clearedNotifications
      ? JSON.parse(clearedNotifications)
      : [];

    setNotificationsToShow(
      fetchedNotifications.notifications.filter(
        (notification: NotificationType) =>
          !clearedNotificationsArray.includes(notification.id)
      )
    );
  }, [fetchedNotifications.notifications, showNotifications]);

  const { auctions: biddingOn } = useFetchAuctionBiddedOnByUserId(
    user?.id
  );

  const { auctions: winningAuctions } = useFetchWinning(user?.id);

  const { auctions: wonAuctions } = useFetchWon(user?.id);

  const earnings = calculateEarnings(wonAuctions);

  return (
    <div className="flex flex-col pt-8 w-full">
      <div className="flex justify-between items-center w-full">
        <div className="flex justify-between items-center w-full">
          <div className="flex lg:gap-6 gap-2">
            <Logo />
            <div className="flex gap-1 bg-white rounded-full p-1">
              <div
                className={`hover:drop-shadow-lg flex gap-1 px-3 py-3 rounded-full cursor-pointer ${
                  activeTopTab === 1 ? "bg-dark-gray text-white" : ""
                }`}
                onClick={() => router.push(`${routes.AUCTIONS_ALL}`)}>
                <HomeIcon className="h-5 w-5" />
                <p className="hidden lg:block">Auctions</p>
              </div>
              <div
                className={`hover:drop-shadow-lg flex gap-1 px-3 py-3 rounded-full cursor-pointer ${
                  activeTopTab === 2 ? "bg-dark-gray text-white" : ""
                }`}
                onClick={() => router.push(`${routes.AUCTIONS_MY}`)}>
                <UserIcon className="h-5 w-5" />
                <p className="hidden lg:block">Profile</p>
              </div>
            </div>
          </div>

          <div className="flex gap-1 bg-white rounded-full justify-center items-center p-1">
            <div
              className="relative p-3 rounded-full bg-gray-blue cursor-pointer hover:drop-shadow-md"
              onClick={handleShowNotifications}>
              <BellIcon />
              <span className="absolute top-0 right-0 inline-block bg-red-400 text-white text-xs px-1 rounded-full">
                {notificationsToShow?.length}
              </span>
            </div>
            <div
              className="p-3 rounded-full bg-fluoro-yellow cursor-pointer hover:drop-shadow-md"
              onClick={handleAddAuctionsClick}>
              <PlusIcon />
            </div>
            <div
              onClick={handleUpdateProfile}
              className="rounded-full cursor-pointer hover:drop-shadow-md">
              {user?.avatar ? (
                <Image
                  alt="avatar"
                  src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/files/${user?.avatar}`}
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
        <div className="flex flex-col py-4 gap-4 mt-4">
          {activeTopTab === 1 && (
            <div className="font-bold lg:text-4xl text-3xl">Auctions</div>
          )}
          {activeTopTab === 2 && (
            <div>
              <h1 className="font-bold lg:text-4xl text-3xl mb-4">
                Hello {user?.first_name} {user?.last_name} !
              </h1>
              <div className="lg:flex grid grid-cols-2 gap-4">
                <div className="flex flex-col justify-between bg-dark-gray gap-4 p-4 text-fluoro-yellow rounded-xl w-full h-40">
                  <div>
                    <h1 className="text-xl font-bold">Earnings</h1>
                    <p className="text-xs font-light">All-time</p>
                  </div>
                  <div className="lg:text-5xl text-4xl font-bold">
                    {earnings} €
                  </div>
                </div>
                <div className="flex flex-col justify-between bg-white gap-4 p-4 rounded-xl w-full h-40">
                  <div>
                    <h1 className="text-xl font-bold">Posted auctions</h1>
                    <p className="text-xs font-light">All time</p>
                  </div>
                  <div className="lg:text-5xl text-4xl font-bold">
                    {auctions.length}
                  </div>
                </div>
                <div className="flex flex-col justify-between bg-white gap-4 p-4 rounded-xl w-full h-40">
                  <div>
                    <h1 className="text-xl font-bold">Currently bidding</h1>
                  </div>
                  <div className="lg:text-5xl text-4xl font-bold">
                    {
                      biddingOn.filter(
                        (auction) => new Date(auction.end_date) > new Date()
                      ).length
                    }
                  </div>
                </div>
                <div className="flex flex-col justify-between bg-white gap-4 p-4 rounded-xl w-full h-40">
                  <div>
                    <h1 className="text-xl font-bold">Currently winning</h1>
                  </div>
                  <div className="lg:text-5xl text-4xl font-bold text-fluoro-green">
                    {winningAuctions.length}
                  </div>
                </div>
              </div>
              <div className="w-full flex flex-col justify-center items-center md:mt-4">
                <div className="w-fit flex justify-center items-center gap-2 p-1 rounded-2xl bg-gray-blue">
                  <Tab
                    active={activeTab === 0}
                    onClick={() => router.push(`${routes.AUCTIONS_MY}`)}>
                    My auctions
                  </Tab>
                  <Tab
                    active={activeTab === 1}
                    onClick={() => router.push(`${routes.AUCTIONS_BIDDING}`)}>
                    Bidding
                  </Tab>
                  <Tab
                    active={activeTab === 2}
                    onClick={() => router.push(`${routes.AUCTIONS_WON}`)}>
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
          refetchAuctions={refetchAuctions}
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

      {showNotifications && (
        <NotificationsPopup setShowNotifications={setShowNotifications} />
      )}
    </div>
  );
};

export default Topbar;
