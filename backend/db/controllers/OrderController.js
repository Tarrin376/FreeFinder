import { getOrdersHandler } from '../services/OrderService.js';

export async function getOrders(req, res) {
    try {
        const orders = await getOrdersHandler(req);
        res.json({ ...orders, message: "success" })
    }
    catch (err) {
        res.status(err.code).json({ message: err.message });
    }
}