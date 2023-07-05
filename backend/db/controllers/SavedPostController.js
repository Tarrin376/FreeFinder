import { savePostHandler, getSavedPostsHandler, deleteSavedPostHandler } from "../services/SavedPostService.js";

export async function savePost(req, res) {
    try {
        console.log(req.userData, req.username);
        await savePostHandler(req.params.postID, req.userData.userID, req.username);
        res.status(201).json({ message: "success" });
    }
    catch (err) {
        res.status(err.code).json({ message: err.message });
    }
}

export async function getSavedPosts(req, res) {
    try {
        const saved = await getSavedPostsHandler(req);
        res.json({ ...saved, message: "success" });
    }
    catch (err) {
        res.status(err.code).json({ message: err.message });
    }
}

export async function deleteSavedPost(req, res) {
    try {
        await deleteSavedPostHandler(req.params.postID, req.userData.userID, req.username);
        res.json({ message: "success" });
    }
    catch (err) {
        res.status(err.code).json({ message: err.message });
    }
}