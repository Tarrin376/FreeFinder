import { IPost } from "../models/IPost";

export async function fetchPosts(url: string, setPosts: React.Dispatch<React.SetStateAction<IPost[]>>): Promise<string> {
    try {
        const getPosts = await fetch(url);
        const res = await getPosts.json();

        if (res.message === "success") {
            setPosts((state) => [...state, ...res.posts]);
            return res.cursor;
        } else {
            throw new Error(res.message);
        }
    }
    catch (err: any) {
        throw err;
    }
}