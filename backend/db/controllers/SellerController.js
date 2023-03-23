import { sellerPostsHandler, updateSellerDetailsHandler } from "../services/SellerService.js";

export async function findSellerPosts(req, res) {
    try {
        const response = await sellerPostsHandler(req.body.userID, req.params.cursor);
        res.json({ posts: response.posts, cursor: response.cursor, message: "success", last: response.last });
    }
    catch (err) {
        res.json({ message: err.message });
    }
}

export async function updateSellerDetails(req, res) {
    try {
        const updatedData = await updateSellerDetailsHandler(req.body);
        res.json({ updatedData, message: "success" });
    }
    catch (err) {
        res.json({ message: err.message });
    }
}