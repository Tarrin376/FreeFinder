import { createPostHandler, savePostHandler, getPostHandler, deletePostHandler } from "../services/PostService.js";

export async function createPost(req, res) {
    const {userID, ...postData} = req.body;
    try {
        await createPostHandler(postData, userID);
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

export async function getSavedPosts(req, res) {
    try {
        const savedPosts = await getSavedPostsHandler(req.body.userID);
        res.json({ savedPosts, message: "success" });
    }
    catch (err) {
        res.json({ message: err.message });
    }
}

export async function getPost(req, res) {
    try {
        if (req.query.id) {
            const post = await getPostHandler(req.query.id);
            res.json({ post, message: "success" });
        } else {
            res.json({ message: "Invalid request" });
        }
    }
    catch (err) {
        res.json({ message: err.message });
    }
}

export async function deletePost(req, res) {
    try {
        await deletePostHandler(req.body.postID);
        res.json({ message: "success" });
    }
    catch (err) {
        res.json({ message: err.message });
    }
}