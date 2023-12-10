import { UserType } from "./auth";
import { BidType } from "./bid";

export type AuctionType = {
  bids: BidType[];
  user: UserType;
  id: string;
  title: string;
  description: string;
  start_price: number;
  end_date: string;
  image: string;
  user_id: string;
};
