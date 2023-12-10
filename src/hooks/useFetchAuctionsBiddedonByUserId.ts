import { useEffect, useState } from "react";
import * as API from "../api/api";
import { useRouter } from "next/navigation";
import { StatusCode } from "../constants/errorConstants";
import { AuctionType } from "../models/auction";
import { routes } from "../constants/routesConstants";

export const useFetchAuctionBiddedOnByUserId = (
  userId: string
): { auctions: AuctionType[]; refetch: () => void } => {

  const [auctions, setAustions] = useState<AuctionType[]>([]);

  const router = useRouter();

  const fetchAuctions = async () => {
    try {
      const auctionData = await API.fetchAuctionBiddedOnByUserId(userId);
      if (auctionData.data?.statusCode === StatusCode.FORBIDDEN) {
        router.push(`${routes.HOME}`);
      } else if (auctionData.data?.statusCode === StatusCode.UNAUTHORIZED) {
        router.push(`${routes.HOME}`);
      } else {
        setAustions(auctionData.data);
      }
    } catch (error) {
      console.error("Error fetching bids data: ", error);
    }
  };

  useEffect(() => {
    fetchAuctions();
  }, [userId]);

  return { auctions, refetch: fetchAuctions };
};
