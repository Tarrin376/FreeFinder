import { IPost } from "../models/IPost";

export async function fetchPosts(userID: string, setUserPosts: React.Dispatch<React.SetStateAction<IPost[]>>, 
    cursor: string): Promise<string> {
    try {
        const getPosts = await fetch(`/post/sellerPosts/${userID}/${cursor}`);
        const res = await getPosts.json();

        if (res.message === "success") {
            setUserPosts((state) => [...state, ...res.posts]);
            return res.cursor;
        } else {
            throw new Error(res.message);
        }
    }
    catch (err: any) {
        throw err;
    }
}