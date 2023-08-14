import { getNotificationsHandler, updateToReadHandler } from "../services/NotificationService.js";

export async function getNotifications(req, res) {
    try {
        const result = await getNotificationsHandler(req);
        res.json({ ...result, message: "success" });
    }
    catch (err) {
        res.status(err.code).json({ message: err.message });
    }
}

export async function updateToRead(req, res) {
    try {
        await updateToReadHandler(req);
        res.json({ message: "success" });
    }
    catch (err) {
        res.status(err.code).json({ message: err.message });
    }
}