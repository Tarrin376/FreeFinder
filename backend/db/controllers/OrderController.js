import { createOrderHandler, getOrdersHandler } from '../services/OrderService.js';

export async function createOrder(req, res) {
    try {
        await createOrderHandler(req);
        res.json({ message: "success" });
    }
    catch (err) {
        res.status(err.code).json({ message: err.message });
    }
}

export async function getOrders(req, res) {
    try {
        const orders = await getOrdersHandler(req);
        res.json({ ...orders, message: "success" })
    }
    catch (err) {
        res.status(err.code).json({ message: err.message });
    }
}