import { AuctionType } from "./auction";
import { UserType } from "./auth";

export type BidType = {
  auction_item: AuctionType
  bid_amount: number
  bidder: UserType
  created_at: string
  id: string
  updated_at: string
  };
  