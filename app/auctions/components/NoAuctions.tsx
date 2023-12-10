import React, { FC } from "react";

const NoAuctions: FC = () => {
  return (
    <div className="flex flex-col w-full h-72 justify-center items-center">
      <div className="lg:w-1/4 text-center flex flex-col gap-2">
        <div className="font-bold text-3xl">Oh no, no auctions yet!</div>
        <div className="font-light text-gray-500">
          To add new auction click “+” button in navigation bar or wait for other users to add new auctions.
        </div>
      </div>
    </div>
  );
};

export default NoAuctions;