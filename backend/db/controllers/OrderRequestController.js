import { sendOrderRequestHandler, updateOrderRequestStatusHandler } from "../services/OrderRequestService.js";

export async function sendOrderRequest(req, res) {
    try {
        const newMessage = await sendOrderRequestHandler(req);
        res.json({ newMessage: newMessage, message: "success" });
    }
    catch (err) {
        res.status(err.code).json({ message: err.message });
    }
}

export async function updateOrderRequestStatus(req, res) {
    try {
        const updatedMessage = await updateOrderRequestStatusHandler(req);
        res.json({ updatedMessage: updatedMessage, message: "success" });
    }
    catch (err) {
        res.status(err.code).json({ message: err.message });
    }
}