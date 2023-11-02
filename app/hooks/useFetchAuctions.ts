import { useState, useEffect } from "react";
import { AuctionType } from "../models/auction";
import * as API from "../api/api";

export const useAuctions = (pageNumber: number) => {
    const [auctions, setAuctions] = useState<AuctionType[]>([]);
  
    useEffect(() => {
      async function fetchData() {
        const data = await API.fetchAuctions(pageNumber);
        setAuctions(data.data.data);
      }
      fetchData();
    }, [pageNumber]);
  
    return auctions;
  };