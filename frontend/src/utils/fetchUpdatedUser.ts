import { IUser } from "../models/IUser";
import axios from "axios";

export async function fetchUpdatedUser(data: IUser, profilePic?: string | unknown): Promise<{ message: string, userData: IUser }> {
    if (profilePic !== undefined) {
        const response = await updateProfilePic(profilePic, data.username);
        data = response.userData;
    }
    
    try {
        const resp = await axios.put<{ userData: IUser, message: string }>(`/api/users/${data.username}`, {
            ...data,
            profilePicURL: profilePic === "" ? profilePic : data.profilePicURL
        });

        return resp.data;
    }
    catch (err: any) {
        throw err;
    }
}

async function updateProfilePic(profilePic: string | unknown, username: string) : Promise<{ message: string, userData: IUser }> {
    try {
        const resp = await axios.put<{ userData: IUser, message: string }>(`/api/users/${username}/profile-picture`, { profilePic });
        return resp.data;
    }
    catch (err: any) {
        throw err;
    }
}