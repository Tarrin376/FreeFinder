import { IUser } from "../models/IUser";

export type UpdateResponse = {
    message: string, 
    userData?: IUser
}

export async function fetchUpdatedUser(updatedData: IUser, profilePic?: string | unknown): Promise<UpdateResponse> {
    if (profilePic) {
        try {
            const response = await updateProfilePic(updatedData.userID, profilePic);
            if (response.status !== "success") {
                throw new Error(response.status)
            }
        }
        catch (err: any) {
            throw err;
        }
    }
    
    try {
        const response = await fetch(`/user/update`, {
            method: 'PUT',
            body: JSON.stringify({
                ...updatedData,
                profilePicURL: profilePic
            }),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        
        if (response.status !== 500) {
            const updated: UpdateResponse = await response.json();
            return updated;
        } else {
            throw new Error(`Looks like we are having trouble on our end. Please try again later. 
            (Error code: ${response.status})`);
        }
    }
    catch (err: any) {
        if (err instanceof SyntaxError) throw new Error("File size is too large");
        else throw err;
    }
}

async function updateProfilePic(userID: string, profilePic: string | unknown) : Promise<any> {
    try {
        const response = await fetch(`/user/update/profile`, {
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

        if (response.status !== 500) {
            const updated = await response.json();
            return updated;
        } else {
            throw new Error(`Looks like we are having trouble on our end. Please try again later. 
            (Error code: ${response.status})`);
        }
    }
    catch (err: any) {
        throw err;
    }
}