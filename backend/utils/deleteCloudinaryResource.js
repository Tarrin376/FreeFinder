import { cloudinary } from "../index.js";
import { DBError } from "../customErrors/DBError.js";

export async function deleteCloudinaryResource(url, type, isFolder = false) {
    try {
        await cloudinary.api.delete_resources_by_prefix(url, { type: 'upload', resource_type: type });
        if (isFolder) {
            await cloudinary.api.delete_folder(url);
        }
    }
    catch (err) {
        throw new DBError(err.error.message, err.error.http_code || 500);
    }
}