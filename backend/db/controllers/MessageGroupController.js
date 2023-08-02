import { 
    getMessageGroupsHandler, 
    leaveMessageGroupHandler, 
    createMessageGroupHandler, 
    deleteMessageGroupHandler,
    updateMessageGroupHandler,
    removeUserHandler
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

export async function createMessageGroup(req, res) {
    try {
        const { group, sockets } = await createMessageGroupHandler(req);
        res.json({ group: group, sockets: sockets, message: "success" });
    }
    catch (err) {
        res.status(err.code).json({ message: err.message });
    }
}

export async function deleteMessageGroup(req, res) {
    try {
        await deleteMessageGroupHandler(req);
        res.json({ message: "success" });
    }
    catch (err) {
        res.status(err.code).json({ message: err.message });
    }
}

export async function updateMessageGroup(req, res) {
    try {
        const { group, sockets } = await updateMessageGroupHandler(req);
        res.json({ group: group, sockets: sockets, message: "success" });
    }
    catch (err) {
        res.status(err.code).json({ message: err.message });
    }
}

export async function removeUser(req, res) {
    try {
        await removeUserHandler(req);
        res.json({ message: "success" });
    }
    catch (err) {
        res.status(err.code).json({ message: err.message });
    }
}