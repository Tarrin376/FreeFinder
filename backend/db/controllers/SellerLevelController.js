import { 
    getSellerLevelsHandler, 
    createSellerLevelHandler, 
    updateSellerLevelHandler, 
    deleteSellerLevelHandler 
} from "../services/SellerLevelService.js";

export async function getSellerLevels(_, res) {
    try {
        const sellerLevels = await getSellerLevelsHandler();
        res.json({ sellerLevels: sellerLevels, message: "success" });
    }
    catch (err) {
        res.status(err.code).json({ message: err.message });
    }
}

export async function createSellerLevel(req, res) {
    try {
        const newLevel = await createSellerLevelHandler(req.body);
        res.status(201).json({ sellerLevel: newLevel, message: "success" });
    }
    catch (err) {
        res.status(err.code).json({ message: err.message });
    }
}

export async function deleteSellerLevel(req, res) {
    try {
        await deleteSellerLevelHandler(req);
        res.json({ message: "success" });
    }
    catch (err) {
        res.status(err.code).json({ message: err.message });
    }
}

export async function updateSellerLevel(req, res) {
    try {
        await updateSellerLevelHandler(req);
        res.json({ message: "success" });
    }
    catch (err) {
        res.status(err.code).json({ message: err.message });
    }
}