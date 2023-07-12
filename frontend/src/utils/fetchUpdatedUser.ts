import { IUser } from "../models/IUser";
import axios from "axios";

export async function fetchUpdatedUser(data: IUser, username: string, profilePic?: string | unknown): Promise<{ message: string, userData: IUser }> {
    if (profilePic !== undefined) {
        const response = await updateProfilePic(profilePic, username);
        data = response.userData;
    }
    
    try {
        const resp = await axios.put<{ userData: IUser, message: string }>(`/api/users/${username}`, {
            ...data,
            profilePicURL: profilePic === "" ? profilePic : data.profilePicURL
        });


        return {
            message: resp.data.message,
            userData: {
                ...resp.data.userData, 
                savedPosts: new Set(resp.data.userData.savedPosts),
                savedSellers: new Set(resp.data.userData.savedSellers)
            }
        }
    }
    catch (err: any) {
        throw err;
    }
}

async function updateProfilePic(profilePic: string | unknown, username: string) : Promise<{ message: string, userData: IUser }> {
    try {
        const resp = await axios.put<{ userData: IUser, message: string }>(`/api/users/${username}/profile-picture`, { profilePic });
        return {
            message: resp.data.message,
            userData: {
                ...resp.data.userData, 
                savedPosts: new Set(resp.data.userData.savedPosts),
                savedSellers: new Set(resp.data.userData.savedSellers)
            }
        }
    }
    catch (err: any) {
        throw err;
    }
}