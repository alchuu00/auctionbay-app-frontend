import { useEffect, useState } from "react";
import * as API from "../api/api";
import {useRouter} from "next/navigation";
import { StatusCode } from "../constants/errorConstants";

export const useFetchBidsByAuctionItemId = (auctionItemId: string) => {
  const [bids, setBids] = useState(null);

  const router = useRouter();

  const fetchBids = async () => {
    try {
      const bidsData = await API.getBidsByAuctionItemId(auctionItemId);
      if (bidsData.data?.statusCode === StatusCode.FORBIDDEN) {
        router.push("/");
      } else if (bidsData.data?.statusCode === StatusCode.UNAUTHORIZED) {
        router.push("/");
      } else {
        setBids(bidsData);
      }
      
    } catch (error) {
      console.error("Error fetching bids data: ", error);
    }
  };

  useEffect(() => {
    fetchBids();
  }, [auctionItemId]);

  return {bids, refetch: fetchBids};
};
