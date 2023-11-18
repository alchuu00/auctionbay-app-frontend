import { AuctionType } from "../models/auction";
  
  interface Props {
    auction: AuctionType | null;
    isUserBidder: boolean | null;
    isCurrentUserWinningBidder: boolean | null;
  }
  
  const auctionStatus = ({ auction, isUserBidder, isCurrentUserWinningBidder }: Props): string => {
    const auctionEndDate = new Date(auction.end_date);
    const now = new Date();
  
    if (auctionEndDate > now) {
      if (isUserBidder) {
        return isCurrentUserWinningBidder ? "Winning" : "Outbid";
      } else {
        return "In progress";
      }
    } else {
      return "Done";
    }
  };
  
  export default auctionStatus;