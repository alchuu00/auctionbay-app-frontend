import { useEffect, useState } from 'react';
import * as API from '../api/api';

export const useFetchBidsByBidderId = (bidderId: string) => {
    const [bids, setBids] = useState(null);

    useEffect(() => {
        const fetchBids = async () => {
            try {
                const bidsData = await API.getBidsByBidderId(bidderId);
                setBids(bidsData);
            } catch (error) {
                console.error("Error fetching bids data: ", error);
            }
        };

        fetchBids();
    }, [bidderId]);

    return bids;
};