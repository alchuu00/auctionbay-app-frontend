import { useEffect, useState } from "react";
import * as API from "../api/api";
import { useRouter } from "next/navigation";
import { StatusCode } from "../constants/errorConstants";
import { AuctionType } from "../models/auction";
import { routes } from "../constants/routesConstants";

export const useFetchAuctionByAuctionItemId = (
  auctionItemId: string
): { auction: AuctionType; refetch: () => void } => {

  const [auction, setAuction] = useState<AuctionType>({} as AuctionType);

  const router = useRouter();

  const fetchAuction = async () => {
    try {
      const auctionData = await API.fetchAuctionById(auctionItemId);
      if (auctionData.data?.statusCode === StatusCode.FORBIDDEN) {
        router.push(`${routes.HOME}`);
      } else if (auctionData.data?.statusCode === StatusCode.UNAUTHORIZED) {
        router.push(`${routes.HOME}`);
      } else {
        setAuction(auctionData.data);
      }
    } catch (error) {
      console.error("Error fetching bids data: ", error);
    }
  };

  useEffect(() => {
    fetchAuction();
  }, [auctionItemId]);

  return { auction, refetch: fetchAuction };
};
