import React, { FC } from "react";

const NoWonBids: FC = () => {
  return (
    <div className="flex flex-col w-screen h-72 justify-center items-center">
      <div className="w-1/4 text-center flex flex-col gap-2">
        <div className="font-bold text-3xl">Nothing here yet?</div>
        <div className="font-light text-gray-500">
          When you win auction items will be displayed here! Go on and bid on your favorite items!
        </div>
      </div>
    </div>
  );
};

export default NoWonBids;