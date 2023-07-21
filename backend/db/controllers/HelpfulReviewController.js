import { markAsHelpfulHandler, markAsUnhelpfulHandler } from "../services/HelpfulReviewService.js";

export async function markAsHelpful(req, res) {
    try {
        await markAsHelpfulHandler(req);
        res.json({ message: "success" });
    }
    catch (err) {
        res.status(err.code).json({ message: err.message });
    }
}

export async function markAsUnhelpful(req, res) {
    try {
        await markAsUnhelpfulHandler(req);
        res.json({ message: "success" });
    }
    catch (err) {
        res.status(err.code).json({ message: err.message });
    }
}