import { createJobCategoryHandler, getJobCategoriesHandler } from "../services/JobCategoryService.js";

export async function createJobCategory(req, res) {
    try {
        await createJobCategoryHandler(req.body.jobCategory);
        res.status(201).json({ message: "success" });
    }
    catch (err) {
        res.status(err.code).json({ message: err.message });
    }
}

export async function getJobCategories(_, res) {
    try {
        const jobCategories = await getJobCategoriesHandler();
        res.json({ jobCategories: jobCategories, message: "success" });
    }
    catch (err) {
        res.status(err.code).json({ message: err.message });
    }
}