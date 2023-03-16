import { createPostHandler } from "../service/PostService.js";

export async function createPost(req, res) {
    try {
        await createPostHandler(req.body, req.params.userID);
        res.send({ message: "success" });
    }
    catch (err) {
        res.send({ message: err.message });
    }
}