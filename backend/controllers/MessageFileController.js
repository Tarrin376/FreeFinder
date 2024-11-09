import { addMessageFileHandler } from "../services/MessageFileService.js";

export async function addMessageFile(req, res) {
    try {
        const file = await addMessageFileHandler(req);
        res.json({ file: file, message: "success" });
    }
    catch (err) {
        res.status(err.code).json({ message: err.message });
    }
}