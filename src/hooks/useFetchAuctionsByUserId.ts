import { useEffect, useState } from "react";
import * as API from "../api/api";
import { useRouter } from "next/navigation";
import { StatusCode } from "../constants/errorConstants";
import { AuctionType } from "../models/auction";
import { routes } from "../constants/routesConstants";

export const useFetchAuctionsByUserId = (
    userId: string
): { auctions: AuctionType[]; fetchAuctions: () => void } => {

  const [auctions, setAuctions] = useState<AuctionType[]>([]);

  const router = useRouter();

  const fetchAuctions = async () => {
    try {
      const auctionsData = await API.fetchAuctionsByUserId(userId);
      if (auctionsData.data?.statusCode === StatusCode.FORBIDDEN) {
        router.push(`${routes.HOME}`);
      } else if (auctionsData.data?.statusCode === StatusCode.UNAUTHORIZED) {
        router.push(`${routes.HOME}`);
      } else {
        setAuctions(auctionsData.data);
      }
    } catch (error) {
      console.error("Error fetching bids data: ", error);
    }
  };

  useEffect(() => {
    fetchAuctions();
  }, [userId]);

  return { auctions, fetchAuctions };
};
