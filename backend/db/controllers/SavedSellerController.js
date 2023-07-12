import { saveSellerHandler, deleteSavedSellerHandler, getSavedSellersHandler } from "../services/SavedSellerService.js";

export async function getSavedSellers(req, res) {
    try {
        const savedSellers = await getSavedSellersHandler(req);
        res.json({ ...savedSellers, message: "success" });
    }
    catch (err) {
        res.status(err.code).json({ message: err.message });
    }
}

export async function saveSeller(req, res) {
    try {
        const savedSellerIDs = await saveSellerHandler(req.params.sellerID, req.userData.userID, req.username);
        res.status(201).json({ savedSellers: savedSellerIDs, message: "success" });
    }
    catch (err) {
        res.status(err.code).json({ message: err.message });
    }
}

export async function deleteSavedSeller(req, res) {
    try {
        const savedSellerIDs = await deleteSavedSellerHandler(req.params.sellerID, req.userData.userID, req.username);
        res.status(200).json({ savedSellers: savedSellerIDs, message: "success" });
    }
    catch (err) {
        res.status(err.code).json({ message: err.message });
    }
}