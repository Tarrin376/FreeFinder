import { cloudinary } from "../index.js";
import { DBError } from "../customErrors/DBError.js";

export async function deleteCloudinaryResource(url, type, isFolder = false) {
    await new Promise((resolve, reject) => {
        cloudinary.api.delete_resources_by_prefix(url, { type: "upload", resource_type: type }, (err, result) => {
            if (err) {
                reject(new DBError(err.message, err.http_code || 500));
            } else {
                resolve(result);
            }
        });
    });

    if (isFolder) {
        await new Promise((resolve, reject) => {
            cloudinary.api.delete_folder(url, (err, result) => {
                if (err && err.http_code !== 404) {
                    reject(new DBError(err.message, err.http_code || 500));
                } else {
                    resolve(result);
                }
            });
        });
    }
}