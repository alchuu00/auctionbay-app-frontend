import { apiRoutes } from "../constants/apiConstatnts";
import { CreateUpdateAuctionFields } from "../hooks/useCreateUpdateAuction";
import { AuctionType } from "../models/auction";
import { apiRequest } from "./api";

export const fetchAuctions = async (pageNumber: number) =>
  apiRequest<undefined, AuctionType[]>(
    "get",
    `${apiRoutes.AUCTIONS_PREFIX}?page=${pageNumber}`
  );

  export const fetchAuctionsByUserId = async (userId: string) =>
  apiRequest<string, AuctionType[]>(
    "get",
    `${apiRoutes.AUCTIONS_PREFIX}/${userId}`
  );

  export const fetchAuctionBiddedOnByUserId = async (userId: string) =>
  apiRequest<string, AuctionType[]>("get", `${apiRoutes.AUCTIONS_PREFIX}/bidded/${userId}`);

export const fetchWon = async (userId: string) =>
  apiRequest<string, AuctionType[]>("get", `${apiRoutes.AUCTIONS_PREFIX}/won/${userId}`);

export const fetchWinning = async (userId: string) =>
  apiRequest<string, AuctionType[]>("get", `${apiRoutes.AUCTIONS_PREFIX}/winning/${userId}`);

export const createAuction = async (data: CreateUpdateAuctionFields) =>
  apiRequest<CreateUpdateAuctionFields, AuctionType>(
    "post",
    apiRoutes.AUCTIONS_PREFIX,
    data
  );

export const uploadAuctionImage = async (formData: FormData, id: string) =>
  apiRequest<FormData, void>(
    "post",
    `${apiRoutes.UPLOAD_AUCTION_IMAGE}/${id}`,
    formData
  );

export const updateAuction = async (
  data: CreateUpdateAuctionFields,
  id: string
) =>
  apiRequest<CreateUpdateAuctionFields, AuctionType>(
    "patch",
    `${apiRoutes.AUCTIONS_PREFIX}/${id}`,
    data
  );

export const deleteAuction = async (id: string) =>
  apiRequest<string, AuctionType>(
    "delete",
    `${apiRoutes.AUCTIONS_PREFIX}/${id}`
  );

export const fetchAuctionById = async (id: string) =>
  apiRequest<string, AuctionType>("get", `${apiRoutes.AUCTIONS_PREFIX}/auction/${id}`);
