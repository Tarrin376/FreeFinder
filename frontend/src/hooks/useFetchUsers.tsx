import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { FoundUsers } from "../types/FoundUsers";
import { getAPIErrorMessage } from "../utils/getAPIErrorMessage";

export function useFetchUsers(userSearch: string, limit: number, setErrorMessage: React.Dispatch<React.SetStateAction<string>>): {
    users: FoundUsers,
    loading: boolean
} {
    const [users, setUsers] = useState<FoundUsers>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        (async (): Promise<void> => {
            try {
                setLoading(true);
                if (userSearch.trim() === "") {
                    setUsers([]);
                    return;
                }
                
                const resp = await axios.get<{ users: FoundUsers, message: string }>
                (`/api/users?search=${userSearch}&limit=${limit}`);
                setUsers(resp.data.users);
            }
            catch (err: any) {
                const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>);
                setErrorMessage(errorMessage);
            }
            finally {
                setLoading(false);
            }
        })();
    }, [userSearch, limit, setErrorMessage, setLoading]);

    return {
        users: users,
        loading: loading
    };
}