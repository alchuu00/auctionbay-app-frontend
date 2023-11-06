import { useEffect, useState } from 'react';
import * as API from '../api/api';

export const useFetchUser = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await API.fetchUser();
                console.log("user data from hook", userData);
                setUser(userData);
            } catch (error) {
                console.error("Error fetching user data: ", error);
            }
        };

        fetchUser();
    }, []);

    return user;
};