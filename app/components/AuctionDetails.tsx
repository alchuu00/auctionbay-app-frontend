import React from "react";
import Image from "next/image";
import { AuctionType } from "../models/auction";

interface Props {
  auction: AuctionType;
}

const AuctionDetails: React.FC<Props> = ({ auction }) => {
  return (
    <div className="flex w-full gap-4">
      <div className="rounded-2xl w-1/2">
        <Image
          src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/files/${auction.image}`}
          alt={auction.title}
          height={500}
          width={500}
          className="rounded-2xl object-cover w-full"
        />
      </div>
      <div className="flex flex-col w-1/2 gap-4">
        <div className="flex flex-col bg-white w-full rounded-2xl p-4 gap-4">
          <div className="flex justify-between items-center">
            <div>Outbid</div>
            <div>24h</div>
          </div>
          <div className="font-bold text-4xl">{auction.title}</div>
          <div>{auction.description}</div>
          <div className="flex gap-10">
            <div className="w-full flex justify-end">
              <form action="submit" className="flex gap-4 justify-end items-center">
                <label htmlFor="">Bid:</label>
                <input type="number" className="rounded-2xl w-24"/>
                <button type="submit" className="px-4 py-2 rounded-full bg-fluoro-yellow cursor-pointer">Place bid</button>
              </form>
            </div>
          </div>
        </div>
        <div className="flex bg-white rounded-2xl p-4">
          <div>Bidding history</div>
          <div>Alja Čekada</div>
        </div>
      </div>
    </div>
  );
};

export default AuctionDetails;
