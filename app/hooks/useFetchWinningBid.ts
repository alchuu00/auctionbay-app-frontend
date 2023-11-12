import { useEffect, useState } from 'react';
import * as API from '../api/api';

export const useGetHighestBidder = (auctionId: string) => {
    const [bids, setBids] = useState(null);

    useEffect(() => {
        const fetchBids = async () => {
            try {
                const bidsData = await API.getHighestBidder(auctionId);
                setBids(bidsData);
            } catch (error) {
                console.error("Error fetching bids data: ", error);
            }
        };

        fetchBids();
    }, [auctionId]);

    return bids;
};