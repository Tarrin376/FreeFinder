import { IPost } from "../models/IPost";

export async function fetchPosts(url: string, setPosts: React.Dispatch<React.SetStateAction<IPost[]>>): Promise<string> {
    try {
        const response = await fetch(url);

        if (response.status !== 500) {
            const responseData = await response.json();
            if (responseData.message === "success") {
                setPosts((state) => [...state, ...responseData.posts]);
                return responseData.cursor;
            } else {
                throw new Error(responseData.message);
            }
        } else {
            throw new Error(`Looks like we are having trouble on our end. Please try again later. 
            (Error code: ${response.status})`);
        }
    }
    catch (err: any) {
        throw err;
    }
}