import { getPostReviewsHandler, createReviewHandler } from "../services/ReviewService.js";

export async function getPostReviews(req, res) {
    try {
        const reviews = await getPostReviewsHandler(req);
        res.json({ ...reviews, message: "success" });
    }
    catch (err) {
        res.status(err.code).json({ message: err.message });
    }
}

export async function createReview(req, res) {
    try {
        const review = await createReviewHandler(req);
        return res.json({ review: review, message: "success" });
    }
    catch (err) {
        res.status(err.code).json({ message: err.message });
    }
}