import { 
    getMessageGroupsHandler, 
    leaveMessageGroupHandler,
    clearUnreadMessagesHandler
} from "../services/MessageGroupService.js";

export async function getMessageGroups(req, res) {
    try {
        const result = await getMessageGroupsHandler(req);
        res.json({ ...result, message: "success" });
    }
    catch (err) {
        res.status(err.code).json({ message: err.message });
    }
}

export async function leaveMessageGroup(req, res) {
    try {
        await leaveMessageGroupHandler(req);
        res.json({ message: "success" });
    }
    catch (err) {
        res.status(err.code).json({ message: err.message });
    }
}

export async function clearUnreadMessages(req, res) {
    try {
        await clearUnreadMessagesHandler(req);
        res.json({ message: "success" });
    }
    catch (err) {
        res.status(err.code).json({ message: err.message });
    }
}