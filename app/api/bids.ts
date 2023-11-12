import { apiRoutes } from "../constants/apiConstatnts";
import { CreateUpdateBidFields } from "../hooks/useCreateUpdateBid";
import { BidType } from "../models/bid";
import { apiRequest } from "./api";

export const placeBid = async (auctionItemId: string, bidderId: string, bidAmount: CreateUpdateBidFields) =>
  apiRequest<{ bidderId: string; bidAmount: CreateUpdateBidFields }, void>(
    'post',
    `${apiRoutes.BIDS_PREFIX}/${auctionItemId}`,
    { bidderId, bidAmount },
  );

export const getBidsByAuctionItemId = async (auctionItemId: string) =>
  apiRequest<undefined, BidType[]>(
    'get',
    `${apiRoutes.BIDS_PREFIX}/${auctionItemId}`,
  );

export const getBidsByBidderId = async (bidderId: string) =>
  apiRequest<undefined, BidType[]>(
    'get',
    `${apiRoutes.BIDS_PREFIX}/bidder/${bidderId}`,
  );

export const getHighestBidder = async (auctionItemId: string) =>
  apiRequest<undefined, BidType>(
    'get',
    `${apiRoutes.BIDS_PREFIX}/${auctionItemId}/winning-bid`,
  );