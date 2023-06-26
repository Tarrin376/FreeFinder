import { IUser } from "../models/IUser";
import axios from "axios";

export async function fetchUpdatedUser(updatedData: IUser, profilePic?: string | unknown): Promise<{ message: string, userData: IUser }> {
    if (profilePic !== undefined) {
        const response = await updateProfilePic(profilePic, updatedData.userID);
        updatedData = response.userData;
    }
    
    try {
        const resp = await axios.put<{ userData: IUser, message: string }>(`/api/users/${updatedData.userID}`, {
            ...updatedData,
            profilePicURL: profilePic === "" ? profilePic : updatedData.profilePicURL
        });

        return resp.data;
    }
    catch (err: any) {
        throw err;
    }
}

async function updateProfilePic(profilePic: string | unknown, userID: string) : Promise<{ message: string, userData: IUser }> {
    try {
        const resp = await axios.put<{ userData: IUser, message: string }>(`/api/users/${userID}/profile-picture`, { profilePic });
        return resp.data;
    }
    catch (err: any) {
        throw err;
    }
}