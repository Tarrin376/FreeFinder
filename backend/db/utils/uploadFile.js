import { cloudinary } from "../index.js";
import { DBError } from "../customErrors/DBError.js";

export function uploadFile(file, url, type) {
    return new Promise(async (resolve, reject) => {
        const upload = cloudinary.uploader.upload(file, { public_id: url, resource_type: type || "image" }, (err, result) => {
            if (err) {
                reject(new DBError(err.message, err.http_code || 500));
            } else {
                resolve(result);
            }
        });

        const success = await upload
        .then(data => data)
        .catch(err => reject(new DBError(err.message, err.http_code || 500)));
        return success;
    });
}