import { updateSellerDetailsHandler, getSellerDetailsHandler, getSellersHandler } from "../services/SellerService.js";

export async function updateSellerDetails(req, res) {
    try {
        const updatedData = await updateSellerDetailsHandler(req);
        res.json({ updatedData, message: "success" });
    }
    catch (err) {
        res.status(err.code).json({ message: err.message });
    }
}

export async function getSellerDetails(req, res) {
    try {
        const sellerDetails = await getSellerDetailsHandler(req.params.username);
        res.json({ sellerDetails, message: "success" });
    }
    catch (err) {
        res.status(err.code).json({ message: err.message });
    }
}

export async function getSellers(req, res) {
    try {
        const result = await getSellersHandler(req.query.search, parseInt(req.body.limit), req.body.cursor);
        res.json({ ...result, message: "success" });
    }
    catch (err) {
        res.status(err.code).json({ message: err.message });
    }
}