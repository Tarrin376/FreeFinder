import { IUser } from "../models/IUser";

export type UpdateResponse = {
    message: string, 
    userData?: IUser
}

export async function fetchUpdatedUser(updatedData: IUser, profilePic?: string | unknown): Promise<UpdateResponse> {
    if (profilePic !== undefined) {
        const response = await updateProfilePic(updatedData.userID, profilePic);
        if (response.message !== "success") {
            throw new Error(response.status);
        } else {
            updatedData = response.userData;
        }
    }
    
    try {
        const response = await fetch("/api/users/update", {
            method: 'PUT',
            body: JSON.stringify({
                ...updatedData,
                profilePicURL: profilePic === "" ? profilePic : updatedData.profilePicURL
            }),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        const responseData = await response.json();
        if (responseData.message === "success") {
            return responseData;
        } else {
            throw new Error(responseData.message);
        }
    }
    catch (err: any) {
        throw err;
    }
}

async function updateProfilePic(userID: string, profilePic: string | unknown) : Promise<any> {
    try {
        const response = await fetch("/api/users/update/profile-picture", {
            method: 'PUT',
            body: JSON.stringify({ 
                userID: userID,
                profilePic 
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 413) {
            throw new Error("File size is too large. Either compress it or select another image.");
        } else {
            const updated = await response.json();
            return updated;
        }
    }
    catch (err: any) {
        throw err;
    }
}