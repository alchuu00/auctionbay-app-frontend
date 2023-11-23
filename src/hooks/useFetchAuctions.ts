import { useState, useEffect } from "react";
import { AuctionType } from "../models/auction";
import * as API from "../api/api";

export const useAuctions = (pageNumber: number, dependencies: any[]) => {
  const [auctions, setAuctions] = useState<AuctionType[]>([]);

  const fetchData = async () => {
    const data = await API.fetchAuctions(pageNumber);
    setAuctions(data.data.data);
  };

  useEffect(() => {
    fetchData();
  }, [pageNumber, ...dependencies]);

  return { auctions, refetch: fetchData };
};
