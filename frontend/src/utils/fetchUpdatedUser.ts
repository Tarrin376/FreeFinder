import { IUser } from "../models/IUser";

export interface UpdateResponse {
    message: string, 
    userData?: IUser
}

export async function fetchUpdatedUser(username: string, updatedData: IUser, profilePic?: string | unknown): Promise<UpdateResponse> {
    if (profilePic) {
        try {
            const response = await updatePhoto(updatedData.userID, profilePic);
            if (response.status !== "success") {
                throw new Error(response.status)
            }
        }
        catch (err: any) {
            throw new Error("Failed to upload image");
        }
    }
    
    const updated: UpdateResponse = await fetch(`/user/update`, {
        method: 'PUT',
        body: JSON.stringify({
            ...updatedData,
            profilePicURL: profilePic
        }),
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    }).then((res) => {
        return res.json();
    }).catch((err) => {
        if (err instanceof SyntaxError) throw new Error("File size is too large");
        else throw err;
    });

    return updated;
}

async function updatePhoto(userID: string, profilePic: string | unknown) : Promise<any> {
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
    }).then((res) => {
        return res.json();
    })
    .catch((err) => {
        throw err;
    });

    return response;
}