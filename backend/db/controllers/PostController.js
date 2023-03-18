import { createPostHandler, savePostHandler } from "../services/PostService.js";

export async function createPost(req, res) {
    try {
        await createPostHandler(req.body, req.params.userID);
        res.json({ message: "success" });
    }
    catch (err) {
        res.json({ message: err.message });
    }
}

export async function savePost(req, res) {
    try {
        await savePostHandler(req.body.postID, req.body.userID);
        res.json({ message: "success" });
    }
    catch (err) {
        res.json({ message: err.message });
    }
}