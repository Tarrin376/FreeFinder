import { IUser } from "../models/IUser";

export type UpdateResponse = {
    status: number, 
    message: string, 
    userData?: IUser
}

export async function fetchUpdatedUser(username: string, updatedData: IUser, profilePic?: string | unknown): Promise<UpdateResponse> {
    if (profilePic) {
        await updatePhoto(username, profilePic);
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
        else throw new Error(err);
    });

    return updated;
}

async function updatePhoto(username: string, profilePic: string | unknown) : Promise<void> {
    await fetch(`user/profile/update/${username}`, {
        method: 'PUT',
        body: JSON.stringify({ profilePic }),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }).catch((err) => {
        throw err;
    });
}