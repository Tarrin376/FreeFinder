import { createWorkTypesHandler } from "../services/workTypeService.js";

export async function createWorkTypes(req, res) {
    try {
        const failed = await createWorkTypesHandler(req.body.workTypes, req.params.jobCategoryID);
        res.status(201).json({ failed: failed, message: "success" });
    }
    catch (err) {
        res.status(err.code).json({ message: err.message });
    }
}