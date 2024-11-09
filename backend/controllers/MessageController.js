import { getMessagesHandler, sendMessageHandler } from "../services/MessageService.js";

export async function getMessages(req, res) {
    try {
        const result = await getMessagesHandler(req);
        res.json({ ...result, message: "success" });
    }
    catch (err) {
        res.status(err.code).json({ message: err.message });
    }
}

export async function sendMessage(req, res) {
    try {
        const result = await sendMessageHandler(req);
        res.json({ ...result, message: "success" });
    }
    catch (err) {
        res.status(err.code).json({ message: err.message });
    }
}