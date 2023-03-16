import { addUserHandler, findUserHandler, updateUserHandler, updateProfilePictureHandler } from '../service/UserService.js';

export async function updateProfilePicture(req, res) {
    try {
        await updateProfilePictureHandler(req.params.username, req.body.profilePic);
        res.json({ status: "success" });
    }
    catch (e) {
        res.json({ status: e.message });
    }
}

export async function addUser(req, res) {
    try {
        await addUserHandler(req.body);
        res.json({ status: "success" });
    }
    catch (e) {
        res.json({ status: e.message });
    }
}

export async function findUser(req, res) {
    try {
        const user = await findUserHandler(req.params.usernameOrEmail, req.body.password);
        res.json({ userData: user });
    }
    catch (e) {
        res.json({ error: e.message });
    }
}

export async function updateUser(req, res) {
    try {
        const updated = await updateUserHandler(req.params.username, req.body);
        res.json({ message: "success", userData: updated });
    }
    catch (e) {
        res.json({ message: e.message });
    }
}