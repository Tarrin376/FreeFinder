import { getSellerPostsHandler, updateSellerDetailsHandler } from "../services/SellerService.js";

export async function getSellerPosts(req, res) {
    try {
        const response = await getSellerPostsHandler(req.params.username, req.body.cursor, req.query.sort);
        res.json({ posts: response.posts, cursor: response.cursor, message: "success", last: response.last });
    }
    catch (err) {
        res.status(err.code).json({ message: err.message });
    }
}

export async function updateSellerDetails(req, res) {
    try {
        const updatedData = await updateSellerDetailsHandler(req);
        res.json({ updatedData, message: "success" });
    }
    catch (err) {
        res.status(err.code).json({ message: err.message });
    }
}