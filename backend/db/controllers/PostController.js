import { createPostHandler, getPostHandler, deletePostHandler, addImageHandler } from "../services/PostService.js";

export async function createPost(req, res) {
    try {
        const result = await createPostHandler(req.body.post, req.body.startingPrice, req.userData.userID);
        res.status(201).json({ postID: result.postID, seller: result.seller, message: "success" });
    }
    catch (err) {
        res.status(err.code).json({ message: err.message });
    }
}

export async function getPost(req, res) {
    try {
        const post = await getPostHandler(req.params.id);
        res.json({ post, message: "success" });
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

export async function addImage(req, res) {
    try {
        await addImageHandler(req);
        res.status(201).json({ message: "success" });
    }
    catch (err) {
        res.status(err.code).json({ message: err.message });
    }
}