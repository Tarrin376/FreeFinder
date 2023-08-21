import { IUser } from "../models/IUser";
import axios from "axios";

export async function fetchUpdatedUser(data: Partial<IUser>, username: string, profilePic?: File | ""): Promise<{ 
    message: string, 
    userData: IUser 
}> {
    const formData = new FormData();
    formData.append("update", JSON.stringify(data));

    if (profilePic !== undefined) {
        if (profilePic === "") formData.append("deleteProfilePic", "true");
        else formData.append("file", profilePic);
    }
    
    const resp = await axios.put<{ userData: IUser, message: string }>(`/api/users/${username}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });

    return resp.data;
}