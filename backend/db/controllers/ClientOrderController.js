import { getClientOrdersHandler } from '../services/ClientOrderService.js';

export async function getClientOrders(req, res) {
    try {
        const orders = await getClientOrdersHandler(req);
        res.json({ ...orders, message: "success" });
    }
    catch (err) {
        res.status(err.code).json({ message: err.message });
    }
}