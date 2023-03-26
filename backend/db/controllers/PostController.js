import { createPostHandler, getPostHandler, deletePostHandler } from "../services/PostService.js";

export async function createPost(req, res) {
    const {userID, ...postData} = req.body;
    try {
        await createPostHandler(postData, userID);
        res.json({ message: "success" });
    }
    catch (err) {
        res.status(err.code).json({ message: err.message });
    }
}

export async function getPost(req, res) {
    try {
        if (req.query.id) {
            const post = await getPostHandler(req.query.id);
            res.json({ post, message: "success" });
        } else {
            res.status(400).json({ message: "Bad request" });
        }
    }
    catch (err) {
        res.status(err.code).json({ message: err.message });
    }
}

export async function deletePost(req, res) {
    try {
        await deletePostHandler(req.body.postID);
        res.json({ message: "success" });
    }
    catch (err) {
        res.status(err.code).json({ message: err.message });
    }
}