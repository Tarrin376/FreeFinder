import { Prisma } from '@prisma/client';
import { findSeller } from './SellerService.js';
import { DBError } from "../customErrors/DBError.js";
import { deleteCloudinaryResource } from '../utils/deleteCloudinaryResource.js';
import { prisma } from '../index.js';
import { v4 as uuidv4 } from 'uuid';
import { sortPosts } from '../utils/sortPosts.js';
import { getPostFilters } from '../utils/getPostFilters.js';
import { postProperties } from '../utils/postProperties.js';
import { getPaginatedData } from '../utils/getPaginatedData.js';
import { getPostedBy } from '../utils/getPostedBy.js';
import { getAvgRatings } from '../utils/getAvgRatings.js';
import { uploadFile } from '../utils/uploadFile.js';
import { MAX_FILE_BYTES } from '@freefinder/shared/dist/constants.js';

export async function createPostHandler(postData, startingPrice, userID) {
    try {
        const seller = await findSeller(userID);
        if (seller._count.posts === seller.sellerLevel.postLimit) {
            throw new DBError(`
                '${seller.sellerLevel.name}' sellers cannot have more than ${seller._count.posts} available 
                ${seller._count.posts === 1 ? " service" : " services"} at the same time.`, 400
            );
        }

        return await prisma.$transaction(async (tx) => {
            const res = await tx.post.create({
                select: { postID: true },
                data: {
                    about: postData.about,
                    title: postData.title,
                    startingPrice: startingPrice,
                    postedBy: {
                        connect: { sellerID: seller.sellerID }
                    },
                    workType: {
                        connect: { name: postData.workType }
                    }
                }
            });

            await tx.package.create({
                data: {
                    postID: res.postID,
                    deliveryTime: postData.packages[0].deliveryTime,
                    revisions: postData.packages[0].revisions,
                    description: postData.packages[0].description,
                    features: postData.packages[0].features,
                    amount: postData.packages[0].amount,
                    type: postData.packages[0].type,
                    title: postData.packages[0].title,
                }
            });
    
            if (postData.packages.length >= 2) {
                await tx.package.create({
                    data: {
                        postID: res.postID,
                        deliveryTime: postData.packages[1].deliveryTime,
                        revisions: postData.packages[1].revisions,
                        description: postData.packages[1].description,
                        features: postData.packages[1].features,
                        amount: postData.packages[1].amount,
                        type: postData.packages[1].type,
                        title: postData.packages[1].title,
                    }
                });
            }
    
            if (postData.packages.length === 3) {
                await tx.package.create({
                    data: {
                        postID: res.postID,
                        deliveryTime: postData.packages[2].deliveryTime,
                        revisions: postData.packages[2].revisions,
                        description: postData.packages[2].description,
                        features: postData.packages[2].features,
                        amount: postData.packages[2].amount,
                        type: postData.packages[2].type,
                        title: postData.packages[2].title,
                    }
                });
            }

            const uuid = uuidv4();
            const result = await uploadFile(postData.thumbnail, `FreeFinder/PostImages/${res.postID}/${uuid}`, MAX_FILE_BYTES, "image");

            await tx.postImage.create({
                data: {
                    postID: res.postID,
                    url: result.secure_url,
                    cloudinaryID: uuid
                }
            });
            
            return {
                postID: res.postID,
                seller: seller
            };
        });
    }
    catch (err) {
        if (err instanceof DBError) {
            throw err;
        } else if (err instanceof Prisma.PrismaClientValidationError) {
            throw new DBError("Missing required fields or fields provided are invalid.", 400);
        } else {
            throw new DBError("Something went wrong. Please try again later.", 500);
        }
    }
    finally {
        await prisma.$disconnect();
    }
}

export async function deleteImageHandler(req) {
    try {
        const postedBy = await getPostedBy(req.params.id);
        if (req.userData.userID !== postedBy) {
            throw new DBError("You are not authorized to delete this image.", 403);
        }

        return await prisma.$transaction(async (tx) => {
            await tx.postImage.delete({
                where: { cloudinaryID: req.params.cloudinaryID }
            });

            const updatedPost = await tx.post.findUnique({ 
                where: { postID: req.params.id },
                select: { ...postProperties }
            });
    
            await deleteCloudinaryResource(
                `FreeFinder/PostImages/${req.params.id}/${req.params.cloudinaryID}`, 
                "image"
            );
            
            return {
                ...updatedPost,
                packages: updatedPost.packages.map((pkg) => {
                    return {
                        ...pkg,
                        amount: parseInt(pkg.amount)
                    }
                })
            };
        });
    }
    catch (err) {
        if (err instanceof DBError) {
            throw err;
        } else if (err instanceof Prisma.PrismaClientValidationError) {
            throw new DBError("Missing required fields or fields provided are invalid.", 400);
        } else {
            throw new DBError("Something went wrong. Please try again later.", 500);
        }
    }
    finally {
        await prisma.$disconnect();
    }
}

export async function addImageHandler(req) {
    try {
        const postedBy = await getPostedBy(req.params.id);
        if (req.userData.userID !== postedBy) {
            throw new DBError("You are not authorized to add an image to this post.", 403);
        }

        const uuid = uuidv4();
        const result = await uploadFile(req.body.image, `FreeFinder/PostImages/${req.params.id}/${uuid}`, MAX_FILE_BYTES, "image");

        return await prisma.$transaction(async (tx) => {
            await tx.postImage.create({
                data: {
                    postID: req.params.id,
                    url: result.secure_url,
                    cloudinaryID: uuid
                }
            });
    
            const updatedPost = await tx.post.findUnique({ 
                where: { postID: req.params.id },
                select: { ...postProperties }
            });
    
            return {
                ...updatedPost,
                packages: updatedPost.packages.map((pkg) => {
                    return {
                        ...pkg,
                        amount: parseInt(pkg.amount)
                    }
                })
            };
        });
    }
    catch (err) {
        if (err instanceof DBError) {
            throw err;
        } else if (err instanceof Prisma.PrismaClientValidationError) {
            throw new DBError("Missing required fields or fields provided are invalid.", 400);
        } else {
            throw new DBError("Something went wrong. Please try again later.", 500);
        }
    }
    finally {
        await prisma.$disconnect();
    }
}

export async function getPostHandler(postID) {
    try {
        const postData = await prisma.post.findUnique({
            where: { postID: postID },
            select: { ...postProperties }
        });
        
        return {
            ...postData,
            packages: postData.packages.map((pkg) => {
                return {
                    ...pkg,
                    amount: parseInt(pkg.amount)
                }
            })
        };
    }
    catch (err) {
        if (err instanceof Prisma.PrismaClientValidationError) {
            throw new DBError("Missing required fields or fields provided are invalid.", 400);
        } else {
            throw new DBError("Something went wrong. Please try again later.", 500);
        }
    }
    finally {
        prisma.$disconnect();
    }
}

export async function updatePostHandler(req) {
    try {
        return await prisma.$transaction(async (tx) => {
            if (req.body.newImage && req.body.imageURL) {
                const image = await tx.postImage.findUnique({ 
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
                
                const uuid = uuidv4();
                const result = await uploadFile(req.body.newImage, `FreeFinder/PostImages/${req.params.id}/${uuid}`, MAX_FILE_BYTES, "image");

                await tx.postImage.update({ 
                    where: {
                        postID_url: {
                            postID: req.params.id,
                            url: req.body.imageURL
                        }
                    },
                    data: {
                        cloudinaryID: uuid,
                        url: result.secure_url
                    }
                });

                await deleteCloudinaryResource(
                    `FreeFinder/PostImages/${req.params.id}/${image.cloudinaryID}`, 
                    "image"
                );
            }

            const updatedPost = await tx.post.update({ 
                where: { postID: req.params.id },
                select: { ...postProperties },
                data: {
                    about: req.body.about,
                    title: req.body.title,
                }
            });
            
            return {
                ...updatedPost,
                packages: updatedPost.packages.map((pkg) => {
                    return {
                        ...pkg,
                        amount: parseInt(pkg.amount)
                    }
                })
            };
        });
    }
    catch (err) {
        if (err instanceof DBError) {
            throw err;
        } else if (err instanceof Prisma.PrismaClientValidationError) {
            throw new DBError("Missing required fields or fields provided are invalid.", 400);
        } else {
            throw new DBError("Something went wrong. Please try again later.", 500);
        }
    }
    finally {
        await prisma.$disconnect();
    }
}

export async function deletePostHandler(postID, userID) {
    try {
        const post = await prisma.post.findUnique({ 
            where: { postID: postID } 
        });

        const user = await prisma.user.findUnique({ 
            where: { userID: userID },
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
        
        await prisma.$transaction(async (tx) => {
            await tx.post.delete({ where: { postID: postID } });
            await deleteCloudinaryResource(`FreeFinder/PostImages/${postID}`, "image", true);
        });
    }
    catch (err) {
        if (err instanceof DBError) {
            throw err;
        } else if (err instanceof Prisma.PrismaClientValidationError) {
            throw new DBError("Missing required fields or fields provided are invalid.", 400);
        } else if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2225") {
            throw new DBError("Post not found.", 404);
        } else {
            throw new DBError("Something went wrong. Please try again later.", 500);
        }
    }
    finally {
        prisma.$disconnect();
    }
}

export async function getPostsHandler(req) {
    try {
        const options = {
            orderBy: sortPosts[req.body.sort],
        };
        
        const where = getPostFilters(req);
        const select = {
            postedBy: {
                select: {
                    user: {
                        select: {
                            profilePicURL: true,
                            status: true,
                            username: true,
                        }
                    },
                    sellerID: true,
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
        };
    
        const result = await getPaginatedData(
            where,
            select, 
            "post", 
            req.body.limit, 
            { postID: req.body.cursor }, 
            "postID", 
            options
        );
    
        const promises = result.next.map(post => getAvgRatings(post.postID, undefined).then(x => x));
        const postRatings = await Promise.all(promises).then(ratings => ratings);
    
        const posts = result.next.map((post, index) => {
            return {
                ...post,
                rating: postRatings[index]._avg.rating
            }
        });
    
        return {
            ...result,
            next: posts
        }
    }
    finally {
        await prisma.$disconnect();
    }
}

export async function getSellerSummaryHandler(postID) {
    try {
        const sellerSummary = await prisma.post.findUnique({
            where: { postID: postID },
            select: {
                postedBy: {
                    select: {
                        user: {
                            select: {
                                profilePicURL: true,
                                status: true,
                                username: true,
                                userID: true
                            }
                        }
                    }
                }
            }
        });

        if (!sellerSummary) {
            throw new DBError("Service ID does not exist.", 404);
        }

        const { userID, ...res } = sellerSummary.postedBy.user;
        return res;
    }
    catch (err) {
        if (err instanceof DBError) {
            throw err;
        } else if (err instanceof Prisma.PrismaClientValidationError) {
            throw new DBError("Missing required fields or fields provided are invalid.", 400);
        } else {
            throw new DBError("Something went wrong. Please try again later.", 500);
        }
    }
}