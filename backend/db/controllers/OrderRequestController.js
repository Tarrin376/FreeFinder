import { sendOrderRequestHandler, updateOrderRequestStatusHandler } from "../services/OrderRequestService.js";

export async function sendOrderRequest(req, res) {
    try {
        const result = await sendOrderRequestHandler(req);
        res.json({ ...result, message: "success" });
    }
    catch (err) {
        res.status(err.code).json({ message: err.message });
    }
}

export async function updateOrderRequestStatus(req, res) {
    try {
        const result = await updateOrderRequestStatusHandler(req);
        res.json({ ...result, message: "success" });
    }
    catch (err) {
        res.status(err.code).json({ message: err.message });
    }
}