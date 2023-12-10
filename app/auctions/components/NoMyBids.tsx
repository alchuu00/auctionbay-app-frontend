import React, { FC } from "react";

const NoMyBids: FC = () => {
  return (
    <div className="flex flex-col w-full h-72 justify-center items-center">
      <div className="lg:w-1/4 text-center flex flex-col gap-2">
        <div className="font-bold text-3xl">No bidding in progress!</div>
        <div className="font-light text-gray-500">
          Start bidding by finding new items you like on “Auctions” page!
        </div>
      </div>
    </div>
  );
};

export default NoMyBids;