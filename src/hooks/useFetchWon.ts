import { useState, useEffect, useRef } from "react";
import { AuctionType } from "../models/auction";
import * as API from "../api/api";
import { StatusCode } from "../constants/errorConstants";
import { useRouter } from "next/navigation";
import { userStorage } from "../stores/userStorage";
import { routes } from "../constants/routesConstants";

const user = userStorage.getUser();

export const useFetchWon = () => {
  const [auctions, setAuctions] = useState<AuctionType[]>([]);

  const router = useRouter();

  const fetchData = async () => {
    const data = await API.fetchWon(user?.user.id);
    if (data.data?.statusCode === StatusCode.FORBIDDEN) {
      router.push(`${routes.HOME}`);
    } else if (data.data?.statusCode === StatusCode.UNAUTHORIZED) {
      router.push(`${routes.HOME}`);
    } else {
      setAuctions(data.data);
    }
  }

  useEffect(() => {
    fetchData;
  }, []);

  return { auctions: auctions ? auctions : [], refetch: ()=>{fetchData} };
};
