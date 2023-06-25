import { createPostHandler, getPostHandler, deletePostHandler, addPostImageHandler } from "../services/PostService.js";

export async function createPost(req, res) {
    try {
        const postID = await createPostHandler(req.body.post, req.body.startingPrice, req.userData.userID);
        res.status(201).json({ message: "success", postID });
    }
    catch (err) {
        res.status(err.code).json({ message: err.message });
    }
}

export async function getPost(req, res) {
    try {
        const post = await getPostHandler(req.params.id);
        res.json({ message: "success", post });
    }
    catch (err) {
        res.status(err.code).json({ message: err.message });
    }
}

export async function deletePost(req, res) {
    try {
        await deletePostHandler(req.params.id, req.userData.userID);
        res.json({ message: "success" });
    }
    catch (err) {
        res.status(err.code).json({ message: err.message });
    }
}

export async function addPostImage(req, res) {
    try {
        await addPostImageHandler(req.params.id, req.body);
        res.status(201).json({ message: "success" });
    }
    catch (err) {
        res.status(err.code).json({ message: err.message });
    }
}