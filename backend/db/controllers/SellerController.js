import { sellerPostsHandler } from "../services/SellerService.js";

export async function findSellerPosts(req, res) {
    try {
        const response = await sellerPostsHandler(req.body.userID, req.params.cursor);
        res.json({ posts: response.posts, cursor: response.cursor, message: "success", last: response.last });
    }
    catch (err) {
        res.json({ message: err.message });
    }
}