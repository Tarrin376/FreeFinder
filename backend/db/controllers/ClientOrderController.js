import { 
    getClientOrdersHandler, 
    cancelClientOrderHandler, 
    sendCompleteOrderRequestHandler,
    updateCompleteOrderRequestHandler
} from '../services/ClientOrderService.js';

export async function getClientOrders(req, res) {
    try {
        const orders = await getClientOrdersHandler(req);
        res.json({ ...orders, message: "success" });
    }
    catch (err) {
        res.status(err.code).json({ message: err.message });
    }
}

export async function cancelClientOrder(req, res) {
    try {
        const result = await cancelClientOrderHandler(req);
        res.json({ notify: result, message: "success" });
    }
    catch (err) {
        res.status(err.code).json({ message: err.message });
    }
}

export async function sendCompleteOrderRequest(req, res) {
    try {
        await sendCompleteOrderRequestHandler(req);
        res.json({ message: "success" });
    }
    catch (err) {
        res.status(err.code).json({ message: err.message });
    }
}

export async function updateCompleteOrderRequest(req, res) {
    try {
        await updateCompleteOrderRequestHandler(req);
        res.json({ message: "success" });
    }
    catch (err) {
        res.status(err.code).json({ message: err.message });
    }
}