import { sendOrderRequestHandler, updateOrderRequestStatusHandler } from "../services/OrderRequestService.js";

export async function sendOrderRequest(req, res) {
    try {
        const { newMessage, sockets } = await sendOrderRequestHandler(req);
        res.json({ newMessage: newMessage, sockets: sockets, message: "success" });
    }
    catch (err) {
        res.status(err.code).json({ message: err.message });
    }
}

export async function updateOrderRequestStatus(req, res) {
    try {
        const { updatedMessage, sockets } = await updateOrderRequestStatusHandler(req);
        res.json({ updatedMessage: updatedMessage, sockets: sockets, message: "success" });
    }
    catch (err) {
        res.status(err.code).json({ message: err.message });
    }
}