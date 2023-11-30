import { useEffect, useState } from "react";
import * as API from "../api/api";
import { useRouter } from "next/navigation";
import { StatusCode } from "../constants/errorConstants";
import { AuctionType } from "../models/auction";

export const useFetchAuctionByAuctionItemId = (
  auctionItemId: string
): { auction: AuctionType; refetch: () => void } => {

  const [auction, setAuction] = useState<AuctionType>({} as AuctionType);

  const router = useRouter();

  const fetchAuction = async () => {
    try {
      const auctionData = await API.fetchAuctionById(auctionItemId);
      if (auctionData.data?.statusCode === StatusCode.FORBIDDEN) {
        router.push("/");
      } else if (auctionData.data?.statusCode === StatusCode.UNAUTHORIZED) {
        router.push("/");
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
