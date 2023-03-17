import { createPostHandler, sellerPostsHandler } from "../service/PostService.js";

export async function createPost(req, res) {
    try {
        await createPostHandler(req.body, req.params.userID);
        res.json({ message: "success" });
    }
    catch (err) {
        res.json({ message: err.message });
    }
}

export async function findSellerPosts(req, res) {
    try {
        const response = await sellerPostsHandler(req.params.userID, req.params.cursor);
        res.json({ posts: response.posts, cursor: response.cursor, message: "success" });
    }
    catch (err) {
        res.json({ message: err.message });
    }
}