import { Prisma } from '@prisma/client';
import { findSeller } from './SellerService.js';
import { DBError } from "../customErrors/DBError.js";
import { deleteCloudinaryResource } from '../utils/deleteCloudinaryResource.js';
import { cloudinary } from '../index.js';
import { prisma } from '../index.js';
import { v4 as uuidv4 } from 'uuid';
import { sortPosts } from '../utils/sortPosts.js';
import { getPostFilters } from '../utils/getPostFilters.js';
import { postProperties } from '../utils/postProperties.js';

async function uploadImage(postID, image, url, uuid, addImage) {
    const result = await new Promise(async (resolve, reject) => {
        const upload = cloudinary.uploader.upload(image, { public_id: `${url}/${uuid}` }, (err, result) => {
            if (err) {
                reject(new DBError(err.message, err.http_code || 500));
            } else {
                resolve(result);
            }
        });

        const success = await upload.then((data) => data);
        return success;
    });

    if (addImage) {
        await prisma.postImage.create({
            data: {
                postID: postID,
                url: result.secure_url,
                cloudinaryID: uuid
            }
        });
    }

    return {
        cloudinaryID: uuid,
        url: result.secure_url
    }
}

export async function createPostHandler(postData, startingPrice, userID) {
    try {
        const seller = await findSeller(userID);
        if (seller._count.posts === seller.sellerLevel.postLimit) {
            throw new DBError(`'${seller.sellerLevel.name}' sellers cannot have more than ${seller._count.posts} available 
            ${seller._count.posts === 1 ? " service" : " services"} at the same time.`, 403);
        }

        const res = await prisma.post.create({
            data: {
                about: postData.about,
                title: postData.title,
                startingPrice: startingPrice,
                sellerID: seller.sellerID,
            },
            select: {
                postID: true
            }
        });

        await createPostPackage(postData.packages[0], res.postID, postData.packages[0].type);
        if (postData.packages.length >= 2) {
            await createPostPackage(postData.packages[1], res.postID, postData.packages[1].type);
        }

        if (postData.packages.length === 3) {
            await createPostPackage(postData.packages[2], res.postID, postData.packages[2].type);
        }

        await uploadImage(
            res.postID, 
            postData.thumbnail, 
            `FreeFinder/PostImages/${userID}/${res.postID}`, 
            uuidv4(), 
            true
        );
        
        const {_count, ...filtered} = seller;
        return {
            postID: res.postID,
            seller: filtered
        };
    }
    catch (err) {
        if (err instanceof DBError) {
            throw err;
        } else if (err instanceof Prisma.PrismaClientValidationError) {
            throw new DBError("Missing required fields or fields provided are invalid.", 400);
        } else {
            throw new DBError("Something went wrong when trying to create your post. Please try again.", 500);
        }
    }
    finally {
        await prisma.$disconnect();
    }
}

async function getPostedBy(id) {
    const post = await prisma.post.findUnique({ 
        where: { 
            postID: id
        },
        select: {
            postedBy: {
                select: {
                    userID: true
                }
            }
        }
    });
    
    if (!post) {
        throw new DBError("Post not found.", 404);
    }

    return post.postedBy.userID;
}

export async function deleteImageHandler(req) {
    try {
        const postedBy = await getPostedBy(req.params.id);
        if (req.userData.userID !== postedBy) {
            throw new DBError("You are not authorized to add an image to this post.", 403);
        }

        await prisma.postImage.delete({
            where: {
                cloudinaryID: req.params.cloudinaryID
            }
        });

        await deleteCloudinaryResource(
            `FreeFinder/PostImages/${req.userData.userID}/${req.params.id}/${req.params.cloudinaryID}`, 
            "file"
        );

        const updatedPost = await prisma.post.findUnique({ 
            where: {
                postID: req.params.id
            },
            ...postProperties
        });

        return updatedPost;
    }
    catch (err) {
        if (err instanceof DBError) {
            throw err;
        } else if (err instanceof Prisma.PrismaClientValidationError) {
            throw new DBError("Missing required fields or fields provided are invalid.", 400);
        } else {
            throw new DBError("Something went wrong when trying to delete this image. Please try again.", 500);
        }
    }
}

export async function addImageHandler(req) {
    try {
        const postedBy = await getPostedBy(req.params.id);
        if (req.userData.userID !== postedBy) {
            throw new DBError("You are not authorized to add an image to this post.", 403);
        }

        await uploadImage(
            req.params.id,
            req.body.image, 
            `FreeFinder/PostImages/${req.userData.userID}/${req.params.id}`,
            uuidv4(),
            true
        );

        const updatedPost = await prisma.post.findUnique({ 
            where: {
                postID: req.params.id
            },
            ...postProperties
        });

        return updatedPost;
    }
    catch (err) {
        if (err instanceof DBError) {
            throw err;
        } else if (err instanceof Prisma.PrismaClientValidationError) {
            throw new DBError("Missing required fields or fields provided are invalid.", 400);
        } else {
            throw new DBError("Something went wrong when trying to add this image. Please try again.", 500);
        }
    }
    finally {
        await prisma.$disconnect();
    }
}

async function createPostPackage(packageData, postID, type) {
    try {
        await prisma.package.create({
            data: {
                postID: postID,
                deliveryTime: packageData.deliveryTime,
                revisions: packageData.revisions,
                description: packageData.description,
                features: packageData.features,
                amount: packageData.amount,
                type: type,
                title: packageData.title,
            }
        });
    }
    catch (err) {
        if (err instanceof Prisma.PrismaClientValidationError) {
            throw new DBError("Missing required fields or fields provided are invalid.", 400);
        } else {
            throw new DBError("Something went wrong when trying to create this package. Please try again.", 500);
        }
    }
    finally {
        await prisma.$disconnect();
    }
}

export async function getPostHandler(postID) {
    try {
        const postData = await prisma.post.findUnique({
            where: {
                postID: postID
            },
            ...postProperties
        });
        
        return postData;
    }
    catch (err) {
        if (err instanceof Prisma.PrismaClientValidationError) {
            throw new DBError("Missing required fields or fields provided are invalid.", 400);
        } else {
            throw new DBError("Something went wrong when trying to get this post. Please try again.", 500);
        }
    }
    finally {
        prisma.$disconnect();
    }
}

async function updateImage(req) {
    try {
        const image = await prisma.postImage.findUnique({ 
            where: {
                postID_url: {
                    postID: req.params.id,
                    url: req.body.imageURL
                }
            },
            select: {
                post: {
                    select: {
                        postedBy: {
                            select: {
                                userID: true
                            }
                        }
                    }
                },
                cloudinaryID: true
            }
        });
    
        if (!image) {
            throw new DBError("Image not found.", 404);
        }
    
        if (req.userData.userID !== image.post.postedBy.userID) {
            throw new DBError("You are not authorized to update this image.", 403);
        }
    
        const newImageUUID = uuidv4();
        const newImage = await uploadImage(
            req.params.id, 
            req.body.newImage, 
            `FreeFinder/PostImages/${req.userData.userID}/${req.params.id}`, 
            newImageUUID,
            false
        );
    
        await prisma.postImage.update({ 
            where: {
                postID_url: {
                    postID: req.params.id,
                    url: req.body.imageURL
                }
            },
            data: {
                cloudinaryID: newImageUUID,
                url: newImage.url
            }
        });
    
        await deleteCloudinaryResource(
            `FreeFinder/PostImages/${req.userData.userID}/${req.params.id}/${image.cloudinaryID}`, 
            "file"
        );
    }
    catch (err) {
        if (err instanceof DBError) {
            throw err;
        } else {
            throw new DBError("Something went wrong when trying to update this post. Please try again.", 500);
        }
    }
}

export async function updatePostHandler(req) {
    try {
        if (req.body.newImage && req.body.imageURL) {
            await updateImage(req);
        }

        const updatedPost = await prisma.post.update({ 
            where: {
                postID: req.params.id
            },
            data: {
                about: req.body.about,
                title: req.body.title,
            },
            ...postProperties
        });

        return updatedPost;
    }
    catch (err) {
        if (err instanceof DBError) {
            throw err;
        } else if (err instanceof Prisma.PrismaClientValidationError) {
            throw new DBError("Missing required fields or fields provided are invalid.", 400);
        } else {
            throw new DBError("Something went wrong when trying to update this post. Please try again.", 500);
        }
    }
}

export async function deletePostHandler(postID, userID) {
    try {
        const post = await prisma.post.findUnique({ where: { postID: postID } });
        const user = await prisma.user.findUnique({ 
            where: { 
                userID: userID 
            },
            select: {
                seller: {
                    select: {
                        sellerID: true
                    }
                }
            }
        });
        
        if (!user) {
            throw new DBError("User not found.", 404);
        } else if (!post) {
            throw new DBError("Post not found.", 404);
        } else if (post.sellerID !== user.seller.sellerID) {
            throw new DBError("You do not have authorization to delete this post.", 403);
        } 
        
        await prisma.post.delete({ where: { postID: postID } });
        await deleteCloudinaryResource(`FreeFinder/PostImages/${userID}/${postID}`, "folder");
    }
    catch (err) {
        if (err instanceof DBError) {
            throw err;
        } else if (err instanceof Prisma.PrismaClientValidationError) {
            throw new DBError("Missing required fields or fields provided are invalid.", 400);
        } else if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
            throw new DBError("Post not found.", 404);
        } else {
            throw new DBError("Something went wrong when trying to delete this post. Please try again.", 500);
        }
    }
    finally {
        prisma.$disconnect();
    }
}

export async function getPostsHandler(req) {
    try {
        return await queryPosts(req);
    }
    catch (err) {
        if (err instanceof Prisma.PrismaClientValidationError) {
            throw new DBError("Missing required fields or fields provided are invalid.", 400);
        } else {
            throw new DBError("Something went wrong when trying to get more posts. Please try again.", 500);
        }
    }
    finally {
        await prisma.$disconnect();
    }
}

async function queryPosts(req) {
    const postFilters = getPostFilters(req);
    const limit = parseInt(req.body.limit);

    const query = {
        take: limit ? limit : undefined,
        skip: req.body.cursor ? 1 : undefined,
        cursor: req.body.cursor ? { postID: req.body.cursor } : undefined,
        where: postFilters,
        orderBy: sortPosts[req.body.sort],
        select: {
            postedBy: {
                select: {
                    user: {
                        select: {
                            profilePicURL: true,
                            status: true,
                            username: true,
                        }
                    },
                    rating: true,
                    sellerLevel: {
                        select: {
                            name: true
                        }
                    }
                }
            },
            createdAt: true,
            _count: {
                select: { 
                    reviews: true
                }
            },
            startingPrice: true,
            title: true,
            postID: true,
            images: {
                select: {
                    url: true,
                    cloudinaryID: true
                },
                orderBy: {
                    createdAt: 'asc'
                }
            }
        }
    };

    const [posts, count] = await prisma.$transaction([
        prisma.post.findMany(query),
        prisma.post.count({ where: { ...postFilters } })
    ]);

    if (posts.length === 0) {
        return { 
            next: posts, 
            cursor: undefined, 
            last: true,
            count: count
        };
    }

    const minNum = Math.min(isNaN(limit) ? posts.length - 1 : limit - 1, posts.length - 1);
    return { 
        next: posts, 
        cursor: posts[minNum].postID,
        last: isNaN(limit) || minNum < limit - 1,
        count: count
    };
}