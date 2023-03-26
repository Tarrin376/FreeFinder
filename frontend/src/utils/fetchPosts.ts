import { IPost } from "../models/IPost";

type fetchPostsRes = {
    cursor: string,
    last: boolean
}

export async function fetchPosts(url: string, sellerUserID: string, setPosts: React.Dispatch<React.SetStateAction<IPost[]>>, cursor: any): Promise<fetchPostsRes> {
    try {
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify({ 
                userID: sellerUserID,
                cursor
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        if (response.status !== 500) {
            const responseData = await response.json();
            if (responseData.message === "success") {
                setPosts((state) => [...state, ...responseData.posts]);
                return { cursor: responseData.cursor, last: responseData.last };
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