import { cloudinary } from "../index.js";
import { DBError } from "../customErrors/DBError.js";

export async function deleteMessageGroupFiles(url) {
    try {
        const result = await cloudinary.api.resources({ type: 'upload', prefix: url });
        
        const deleteFiles = result.resources.map(async (resource) => {
            await cloudinary.api.delete_resources_by_prefix(resource.folder, { type: 'upload', resource_type: 'raw' });
            await cloudinary.api.delete_resources_by_prefix(resource.folder, { type: 'upload', resource_type: 'image' });
            await cloudinary.api.delete_folder(resource.folder);
        });

        await Promise.all(deleteFiles);
        await cloudinary.api.delete_folder(url);
    }
    catch (err) {
        throw new DBError(err.error.message, err.error.http_code || 500);
    }
}