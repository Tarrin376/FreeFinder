import { cloudinary } from "../index.js";
import { DBError } from "../customErrors/DBError.js";

export function uploadFile(file, url) {
    return new Promise(async (resolve, reject) => {
        const upload = cloudinary.uploader.upload(file, { public_id: url }, (err, result) => {
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