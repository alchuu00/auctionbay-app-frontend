import React, { FC } from "react";

const NotificationsPopup: FC = () => {
  return (
    <div className="flex flex-col absolute right-5 top-24 bg-white h-2/5 w-1/3 rounded-2xl p-4">
      <div className="flex w-full justify-between items-center mb-4">
        <div className="text-xl font-bold">Notifications</div>
        <div className="text-sm hover:cursor-pointer">Clear all</div>
      </div>
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center gap-2">
          <div>image</div>
          <div>
            <div>Item name</div>
            <div>notification date</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div>status</div>
          <div>price</div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPopup;
