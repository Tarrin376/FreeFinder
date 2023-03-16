import { IUser } from "../models/IUser";

export interface UpdateResponse {
    message: string, 
    userData?: IUser
}

export async function fetchUpdatedUser(username: string, updatedData: IUser, profilePic?: string | unknown): Promise<UpdateResponse> {
    if (profilePic) {
        try {
            const response = await updatePhoto(username, profilePic);
            if (response.status !== "success") {
                throw new Error(response.status)
            }
        }
        catch (e) {
            throw new Error("Failed to upload image");
        }
    }
    
    const updated: UpdateResponse = await fetch(`/user/update/${username}`, {
        method: 'PUT',
        body: JSON.stringify({ ...updatedData, profilePicURL: profilePic }),
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

async function updatePhoto(username: string, profilePic: string | unknown) : Promise<any> {
    const response = await fetch(`user/profile/update/${username}`, {
        method: 'PUT',
        body: JSON.stringify({ profilePic }),
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