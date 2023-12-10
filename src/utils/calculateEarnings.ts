import { AuctionType } from "../models/auction";

export const calculateEarnings = (wonAuctions: AuctionType[]) => {
  let totalEarnings = 0;
  if (wonAuctions.length > 0) {
    wonAuctions.forEach((auction) => {
      let highestBid = auction.bids.reduce((prev, current) => {
        return prev.bid_amount > current.bid_amount ? prev : current;
      });
      totalEarnings += highestBid.bid_amount;
    });
  }
  return totalEarnings;
};
