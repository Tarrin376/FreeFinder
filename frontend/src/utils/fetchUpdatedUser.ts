import { IUser } from "../models/IUser";

export type UpdateResponse = {
    message: string, 
    userData?: IUser
}

export async function fetchUpdatedUser(updatedData: IUser, profilePic?: string | unknown): Promise<UpdateResponse> {
    if (profilePic) {
        try {
            const response = await updateProfilePic(updatedData.userID, profilePic);
            if (response.message !== "success") {
                throw new Error(response.status);
            } else {
                updatedData = response.userData;
            }
        }
        catch (err: any) {
            throw err;
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

        if (response.status === 403) {
            throw new Error("You do not have authorisation to perform this action");
        } else if (response.status === 500) {
            throw new Error(`Looks like we are having trouble on our end. Please try again later. 
            (Error code: ${response.status})`);
        } else {
            const updated: UpdateResponse = await response.json();
            return updated;
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
        
        if (response.status === 403) {
            throw new Error("You do not have authorisation to perform this action");
        } else if (response.status === 500) {
            throw new Error(`Looks like we are having trouble on our end. Please try again later. 
            (Error code: ${response.status})`);
        } else if (response.status === 413) {
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