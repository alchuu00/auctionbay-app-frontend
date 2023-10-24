import React from "react";
import Logo from "./Logo";
import HomeIcon from "@heroicons/react/outline/HomeIcon";
import UserIcon from "@heroicons/react/outline/UserIcon";
import UserCircleIcon from "@heroicons/react/outline/UserCircleIcon";
import PlusIcon from "./PlusIcon";

const Topbar = () => {
  return (
    <div className="flex justify-between items-center py-5 px-8">
      <div className="flex items-center w-fit gap-8">
        <Logo />
        <div className="flex gap-1 bg-white rounded-full p-1">
          <div className="flex gap-1 px-3 py-3">
            <HomeIcon className="h-5 w-5" />
            <p>Auctions</p>
          </div>
          <div className="flex gap-1 px-3 py-3 bg-dark-gray text-white rounded-full">
            <UserIcon className="h-5 w-5" />
            <p>Profile</p>
          </div>
        </div>
      </div>
      <div className="flex gap-1 bg-white rounded-full justify-center items-center p-1">
        <div className="p-3 rounded-full bg-fluoro-yellow">
          <PlusIcon />
        </div>
        <div className="p-3 rounded-full bg-gray-blue">
            <UserCircleIcon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
};

export default Topbar;
