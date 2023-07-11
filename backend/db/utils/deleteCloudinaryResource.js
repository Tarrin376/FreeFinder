import { cloudinary } from "../index.js";
import { DBError } from "../customErrors/DBError.js";

export async function deleteCloudinaryResource(url, type) {
    await new Promise((resolve, reject) => {
        cloudinary.api.delete_resources_by_prefix(url, { type: "upload" }, (err, result) => {
            if (err) {
                reject(new DBError(err.message, err.http_code || 500));
            } else {
                resolve(result);
            }
        });
    });

    if (type === "folder") {
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