import { cloudinary } from "../index.js";
import { DBError } from "../customErrors/DBError.js";
import { deleteCloudinaryResource } from "./deleteCloudinaryResource.js";
import axios from "axios";

const imageTransformation = {
    eager: [{ 
        format: "webp"
    }],
    transformation: {
        quality: "auto"
    }
}

export async function uploadFile(newFile, url, max_bytes, type) {
    try {
        if (type === "image") {
            const result = await cloudinary.api.resource(url);
            const imageContent = await axios.get(result.secure_url, { responseType: 'arraybuffer' });
            const base64FileData = Buffer.from(imageContent.data).toString('base64');
            return await uploader(newFile, url, max_bytes, type, { result: result, base64FileData: base64FileData });
        } else {
            return await uploader(newFile, url, max_bytes, type);
        }
    }
    catch (err) {
        if (err instanceof DBError) {
            throw err;
        } else if (err.error) {
            if (err.error.http_code === 404) return await uploader(newFile, url, max_bytes, type);
            else throw new DBError(err.error.message, err.error.http_code || 500);
        } else {
            throw new DBError("Something went wrong. Please try again later.", 500);
        }
    }
}

async function uploader(newFile, url, max_bytes, type, prevImage) {
    try {
        const upload = await cloudinary.uploader.upload(newFile, { 
            public_id: url, 
            resource_type: type,
            eager: type === "image" ? imageTransformation.eager : undefined,
            transformation: type === "image" ? imageTransformation.transformation : undefined
        });
    
        if (upload.bytes > max_bytes) {
            await deleteCloudinaryResource(url, type);
            if (prevImage) {
                await cloudinary.uploader.upload(`data:image/jpeg;base64,${prevImage.base64FileData}`, {
                    public_id: prevImage.result.public_id,
                    resource_type: "image",
                    ...imageTransformation
                });
            }

            throw new DBError(`File must not exceed ${max_bytes / 1000000}MB in size.`, 400);
        }
    
        return upload;
    }
    catch (err) {
        if (err instanceof DBError) {
            throw err;
        } else if (err.error) {
            throw new DBError(err.error.message, err.http_code || 500);
        } else {
            throw new DBError("Something went wrong. Please try again later.", 500);
        }
    }
}