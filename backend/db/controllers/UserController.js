import { addUserHandler, findUserHandler, updateUserHandler, updateProfilePictureHandler } from '../service/UserService.js';

export async function updateProfilePicture(req, res) {
    try {
        await updateProfilePictureHandler(req.params.username, req.body.profilePic);
        res.status(200);
        res.send("success");
    }
    catch (e) {
        throw e;
    }
}

export async function addUser(req, res) {
    try {
        await addUserHandler(req.body);
        res.json({ status: 200, message: "success" });
    }
    catch (e) {
        res.json({ status: 400, message: e.message });
    }
}

export async function findUser(req, res) {
    try {
        const user = await findUserHandler(req.params.usernameOrEmail, req.body.password);
        res.json({ status: 200, message: "success", data: user });
    }
    catch (e) {
        res.json({ status: 400, message: e.message });
    }
}

export async function updateUser(req, res) {
    try {
        const updated = await updateUserHandler(req.params.username, req.body);
        res.json({ status: 200, message: "success", userData: updated });
    }
    catch (e) {
        res.json({ status: 400, message: e.message });
    }
}