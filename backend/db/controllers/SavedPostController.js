import { savePostHandler, getSavedPostsHandler } from "../services/SavedPostService.js";

export async function savePost(req, res) {
    try {
        await savePostHandler(req.body.postID, req.body.userID);
        res.json({ message: "success" });
    }
    catch (err) {
        res.status(err.code).json({ message: err.message });
    }
}

export async function getSavedPosts(req, res) {
    try {
        const saved = await getSavedPostsHandler(req.body.userID, req.body.cursor, req.query.sort);
        res.json({ ...saved, message: "success" });
    }
    catch (err) {
        res.status(err.code).json({ message: err.message });
    }
}