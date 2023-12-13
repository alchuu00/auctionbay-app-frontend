import { AuctionType } from "../models/auction";

export const countdown = (auction: AuctionType) => {
  if (new Date(auction.end_date) > new Date()) {
    const diffInMilliseconds =
      new Date(auction.end_date).getTime() - new Date().getTime();
    const diffInHours = diffInMilliseconds / (1000 * 60 * 60);
    return Math.ceil(diffInHours); // Use Math.ceil to round up to the nearest hour
  }
  return null; // Return null if the auction has ended
};
