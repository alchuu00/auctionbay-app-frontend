import { useEffect, useState } from 'react';
import * as API from '../api/api';

export const useGetHighestBidder = (auctionId: string) => {
    const [highestBidderId, setHighestBidderId] = useState(null);

    useEffect(() => {
        const fetchHighestBidderId = async () => {
            try {
                const highestBidderIdData = await API.getHighestBidder(auctionId);
                setHighestBidderId(highestBidderIdData);
            } catch (error) {
                console.error("Error fetching highest bidder data: ", error);
            }
        };

        fetchHighestBidderId();
    }, [auctionId]);

    return highestBidderId;
};