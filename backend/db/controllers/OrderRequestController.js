import { sendOrderRequestHandler } from "../services/OrderRequestService.js";

export async function sendOrderRequest(req, res) {
    try {
        const newMessage = await sendOrderRequestHandler(req);
        res.json({ newMessage: newMessage, message: "success" });
    }
    catch (err) {
        res.status(err.code).json({ message: err.message });
    }
}