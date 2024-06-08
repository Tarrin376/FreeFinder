import { getOrdersHandler, updateCompleteOrderRequestHandler } from '../services/OrderService.js';

export async function getOrders(req, res) {
    try {
        const orders = await getOrdersHandler(req);
        res.json({ ...orders, message: "success" })
    }
    catch (err) {
        res.status(err.code).json({ message: err.message });
    }
}

export async function updateCompleteOrderRequest(req, res) {
    try {
        const result = await updateCompleteOrderRequestHandler(req);
        res.json({ ...result, message: "success" });
    }
    catch (err) {
        res.status(err.code).json({ message: err.message });
    }
}