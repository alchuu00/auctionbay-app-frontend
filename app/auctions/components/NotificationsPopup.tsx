"use client";

import { useFetchNotifications } from "@/src/hooks/useFetchNotifications";
import React, { FC, useEffect, useMemo, useState } from "react";
import Image from "next/image";

interface Props {
  setShowNotifications: (showNotifications: boolean) => void;
}

const NotificationsPopup: FC<Props> = ({ setShowNotifications }) => {
  const [clearedNotifications, setClearedNotifications] = useState<string[]>(
    () => JSON.parse(localStorage.getItem("clearedNotifications") || "[]")
  );

  const { notifications } = useFetchNotifications();

  const unclearedNotifications = useMemo(
    () =>
      notifications.filter(
        (notification) => !clearedNotifications.includes(notification.id)
      ),
    [notifications, clearedNotifications]
  );

  useEffect(() => {
    localStorage.setItem(
      "clearedNotifications",
      JSON.stringify(clearedNotifications)
    );
  }, [clearedNotifications]);

  useEffect(() => {
    // When the component is mounted, add a rule to the body to hide the scrollbar
    document.body.style.overflow = "hidden";

    // When the component is unmounted, remove the rule from the body to show the scrollbar
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          setShowNotifications(false);
        }
      }}
      className="backdrop-blur-sm bg-dark-gray bg-opacity-10 fixed top-0 left-0 right-0 bottom-0 m-auto flex flex-col justify-center items-center h-full">
      <div className="flex flex-col absolute bg-white h-fit lg:w-1/3 md:w-2/3 w-full rounded-2xl p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="text-xl font-bold">Notifications</div>
          <div
            className="text-sm hover:cursor-pointer hover:drop-shadow-md"
            onClick={() => {
              setClearedNotifications([
                ...clearedNotifications,
                ...notifications.map((n) => n.id),
              ]);
            }}>
            Clear all
          </div>
        </div>
        {unclearedNotifications.length === 0 && <div>No notifications.</div>}
        {unclearedNotifications &&
          unclearedNotifications.length > 0 &&
          unclearedNotifications.map((notification, index) => (
            <div key={index} className="flex justify-between items-center">
              <div className="flex justify-between items-center w-full">
                <div className="flex items-center w-3/4">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/files/${notification.auctionItemImage}`}
                    alt={notification.auctionItemTitle}
                    height={30}
                    width={30}
                    className="rounded-md object-cover"
                  />
                  <div className="w-full">
                    <p className="truncate">{notification.message}</p>
                    <div className="font-extralight text-xs">
                      {new Date(notification.created_at).toLocaleDateString(
                        undefined,
                        { year: "numeric", month: "2-digit", day: "2-digit" }
                      )}{" "}
                      {new Date(notification.created_at).toLocaleTimeString(
                        undefined,
                        { hour: "2-digit", minute: "2-digit", hour12: false }
                      )}
                    </div>
                  </div>
                </div>
                <div className="w-1/4 flex justify-end">
                <div className="rounded-full px-2 py-1 bg-dark-gray text-white text-center w-fit font-light text-sm">
                  {notification.bidAmount} €
                </div></div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default NotificationsPopup;
