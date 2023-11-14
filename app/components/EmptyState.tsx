import React, { FC } from "react";

interface Props {
  activeTab: number | null;
  activeTopTab: number | null;
}

const EmptyState: FC<Props> = ({ activeTab, activeTopTab }) => {
  return (
    <div className="flex flex-col w-screen h-72 justify-center items-center">
      <div className="w-1/4 text-center flex flex-col gap-2">
        <div className="font-bold text-3xl">
          {activeTopTab === 1 && "Oh no, no auctions yet!"}
          {activeTopTab === 2 && activeTab === 0 && "Oh no, no auctions added!"}
          {activeTopTab === 2 && activeTab === 1 && "No bidding in progress!"}
          {activeTopTab === 2 && activeTab === 2 && "Nothing here yet?"}
        </div>
        <div className="font-light text-gray-500">
          {activeTopTab === 1 &&
            "To add new auction click “+” button in navigation bar or wait for other users to add new auctions."}
          {activeTopTab === 2 &&
            activeTab === 0 &&
            "To add new auction click “+” button in navigation bar and new auctions wil be added here!"}
          {activeTopTab === 2 &&
            activeTab === 1 &&
            "Start bidding by finding new items you like on “Auction” page!"}
          {activeTopTab === 2 &&
            activeTab === 2 &&
            "When you win auction items will be displayed here! Go on and bid on your favorite items!"}
        </div>
      </div>
    </div>
  );
};

export default EmptyState;
