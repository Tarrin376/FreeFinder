import { cloudinary } from "../index.js";
import { DBError } from "../customErrors/DBError.js";
import { SUPPORTED_IMAGE_FORMATS, SUPPORTED_FILE_FORMATS } from "@freefinder/shared/dist/constants.js";

const imageTransformation = {
    eager: [{ 
        format: "webp"
    }],
    transformation: {
        quality: "auto"
    }
}

export async function uploadFile(file, url, max_bytes, isImage, tags) {
    try {
        if (isImage) {
            if (!file.mimetype.startsWith("image/")) {
                throw new DBError("Only image files allowed.", 400);
            } else if (!SUPPORTED_IMAGE_FORMATS.includes(file.mimetype.substring(6))) {
                throw new DBError("Image format is not supported.", 400);
            }
        } else if (!Object.keys(SUPPORTED_FILE_FORMATS).includes(file.mimetype)) {
            throw new DBError("File format is not supported.", 400);
        }

        if (file.size > max_bytes) {
            throw new DBError(`File must not exceed ${max_bytes / 1000000}MB in size.`, 400);
        }

        const upload = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({
                public_id: url, 
                resource_type: isImage ? "image" : "raw",
                eager: isImage ? imageTransformation.eager : undefined,
                transformation: isImage ? imageTransformation.transformation : undefined,
                tags: tags
            }, (error, result) => {
                if (error) {
                    reject(new DBError(error.message, error.http_code || 500));
                } else {
                    resolve(result);
                }
            }).end(file.buffer);
        });
    
        return upload;
    }
    catch (err) {
        if (err instanceof DBError) {
            throw err;
        } else if (err.error) {
            throw new DBError(err.error.message, err.error.http_code || 500);
        } else {
            throw new DBError("Something went wrong. Please try again later.", 500);
        }
    }
}