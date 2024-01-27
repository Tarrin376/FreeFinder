import { 
    createMessageGroupHandler,
    deleteMessageGroupHandler, 
    updateMessageGroupHandler, 
    removeUserHandler
} from "../services/CreatedMessageGroupService.js";

export async function createMessageGroup(req, res) {
    try {
        const result = await createMessageGroupHandler(req);
        res.json({ ...result, message: "success" });
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
        const result = await updateMessageGroupHandler(req);
        res.json({ ...result, message: "success" });
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