import { useEffect, useState } from "react";
import * as API from "../api/api";

export const useFetchBidsByAuctionItemId = (auctionItemId: string) => {
  const [bids, setBids] = useState(null);

  const fetchBids = async () => {
    try {
      const bidsData = await API.getBidsByAuctionItemId(auctionItemId);
      setBids(bidsData);
    } catch (error) {
      console.error("Error fetching bids data: ", error);
    }
  };

  useEffect(() => {
    fetchBids();
  }, [auctionItemId]);

  return {bids, refetch: fetchBids};
};
