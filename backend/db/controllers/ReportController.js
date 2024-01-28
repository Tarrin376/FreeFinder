import { reportSellerHandler } from '../services/ReportService.js';

export async function reportSeller(req, res) {
    try {
        await reportSellerHandler(req);
        return res.json({ message: "success" });
    }
    catch (err) {
        res.status(err.code).json({ message: err.message });
    }
}