import { useEffect, useState } from 'react';
import * as API from '../api/api';

export const useFetchBids = (auctionItemId: string) => {
    const [bids, setBids] = useState(null);

    useEffect(() => {
        const fetchBids = async () => {
            try {
                const bidsData = await API.getBidsByAuctionItemId(auctionItemId);
                setBids(bidsData);
                console.log('bids data', bidsData);
            } catch (error) {
                console.error("Error fetching bids data: ", error);
            }
        };

        fetchBids();
    }, [auctionItemId]);

    return bids;
};