import { useState, useEffect } from "react";
import { AuctionType } from "../models/auction";
import * as API from "../api/api";
import { StatusCode } from "../constants/errorConstants";
import { useRouter } from "next/navigation";
import { routes } from "../constants/routesConstants";

export const useAuctions = (pageNumber: number, dependencies: any[]) => {
  const [auctions, setAuctions] = useState<AuctionType[]>([]);

  const router = useRouter();

  const fetchData = async () => {
    const data = await API.fetchAuctions(pageNumber);
    if (data.data?.statusCode === StatusCode.FORBIDDEN) {
      router.push(`${routes.HOME}`);
    } else if (data.data?.statusCode === StatusCode.UNAUTHORIZED) {
      router.push(`${routes.HOME}`);
    } else {
      setAuctions(data.data.data);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pageNumber, ...dependencies]);

  return { auctions, refetch: fetchData };
};
