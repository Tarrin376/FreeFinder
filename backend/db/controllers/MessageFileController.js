import { addMessageFileHandler } from "../services/MessageFileService.js";

export async function addMessageFile(req, res) {
    try {
        const newFile = await addMessageFileHandler(req);
        res.json({ newFile: newFile, message: "success" });
    }
    catch (err) {
        res.status(err.code).json({ message: err.message });
    }
}