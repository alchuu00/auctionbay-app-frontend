import { useEffect, useState } from "react";
import * as API from "../api/api";
import { useRouter } from "next/navigation";
import { StatusCode } from "../constants/errorConstants";
import { BidType } from "../models/bid";

export const useFetchBidsByBidderId = (
  bidderId: string
): { bids: BidType[]; fetchBids: () => void } => {

  const [bids, setBids] = useState<BidType[]>([]);

  const router = useRouter();

  const fetchBids = async () => {
    try {
      const bidsData = await API.getBidsByBidderId(bidderId);
      if (bidsData.data?.statusCode === StatusCode.FORBIDDEN) {
        router.push("/");
      } else if (bidsData.data?.statusCode === StatusCode.UNAUTHORIZED) {
        router.push("/");
      } else {
        setBids(bidsData.data);
      }
    } catch (error) {
      console.error("Error fetching bids data: ", error);
    }
  };

  useEffect(() => {
    fetchBids();
  }, [bidderId]);

  return { bids, fetchBids };
};
