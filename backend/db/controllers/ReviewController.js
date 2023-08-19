import { createReviewHandler } from "../services/ReviewService.js";

export async function createReview(req, res) {
    try {
        const notify = await createReviewHandler(req);
        return res.json({ notify: notify, message: "success" });
    }
    catch (err) {
        res.status(err.code).json({ message: err.message });
    }
}