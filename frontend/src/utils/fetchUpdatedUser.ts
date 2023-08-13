import { IUser } from "../models/IUser";
import axios from "axios";

export async function fetchUpdatedUser(data: Partial<IUser>, username: string, profilePic?: string | unknown): Promise<{ 
    message: string, 
    userData: IUser 
}> {
    const resp = await axios.put<{ userData: IUser, message: string }>(`/api/users/${username}`, {
        ...data,
        profilePic: profilePic
    });

    return resp.data;
}