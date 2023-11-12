import { useEffect, useState } from 'react';
import * as API from '../api/api';

export const useFetchUser = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await API.fetchUser();
                setUser(userData);
            } catch (error) {
                console.error("Error fetching user data: ", error);
            }
        };

        fetchUser();
    }, []);

    return user;
};