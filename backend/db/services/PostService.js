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
import { getAvgRatings } from '../utils/getAvgRatings.js';
import { uploadFile } from '../utils/uploadFile.js';
import { 
    MAX_FILE_BYTES, 
    MAX_SERVICE_FEATURES, 
    MAX_SERVICE_PRICE, 
    MAX_SERVICE_DELIVERY_DAYS, 
    REVISIONS,
    SERVICE_TITLE_LIMIT,
    MAX_SERVICE_IMAGE_UPLOADS
} from '@freefinder/shared/dist/constants.js';
import Validator from '@freefinder/shared/dist/validator.js';
import { notificationProperties } from '../utils/notificationProperties.js';
import fs from 'fs';

async function checkPackages(packages) {
    try {
        for (const pkg of packages) {
            if (!Validator.isInteger(pkg.deliveryTime.toString(), MAX_SERVICE_DELIVERY_DAYS) || pkg.deliveryTime <= 0) {
                throw new DBError(`Package delivery time must be a number between 1 and ${MAX_SERVICE_DELIVERY_DAYS}.`, 400);
            } else if (!Validator.isInteger(pkg.amount.toString(), MAX_SERVICE_PRICE) || pkg.amount <= 0) {
                throw new DBError(`Package amount must be a number between 1 and ${MAX_SERVICE_PRICE}.`, 400);
            } else if (pkg.features.length > MAX_SERVICE_FEATURES) {
                throw new DBError(`You cannot have more than ${MAX_SERVICE_FEATURES} features in one package.`, 400);
            } else if (!REVISIONS.includes(pkg.revisions)) {
                throw new DBError(`Package revisions must be one of these values: (${REVISIONS.join(", ")}).`, 400);
            }
        }
    }
    catch (err) {
        if (err instanceof DBError) {
            throw err;
        } else {
            throw new DBError("Missing required fields or fields provided are invalid.", 400);
        }
    }
}

export async function createPostHandler(req) {
    try {
        if (!req.file) {
            throw new DBError("Post thumbnail not specified.", 400);
        } else if (!req.body.post) {
            throw new DBError("Post not specified.", 400);
        }

        const post = JSON.parse(req.body.post);
        await checkPackages(post.packages);
        const seller = await findSeller(req.userData.userID);

        if (seller._count.posts === seller.sellerLevel.postLimit) {
            throw new DBError(`
                '${seller.sellerLevel.name}' sellers cannot have more than ${seller._count.posts} available 
                ${seller._count.posts === 1 ? " service" : " services"} at the same time.`, 400
            );
        }

        if (!post.title || post.title.length > SERVICE_TITLE_LIMIT) {
            throw new DBError(`Title must be between 1 and ${SERVICE_TITLE_LIMIT} characters long.`, 400);
        }

        const startingPrice = post.packages.reduce((acc, cur) => Math.min(cur.amount, acc), Infinity);
        return await prisma.$transaction(async (tx) => {
            const res = await tx.post.create({
                select: { postID: true },
                data: {
                    about: post.about,
                    title: post.title,
                    startingPrice: startingPrice,
                    postedBy: {
                        connect: { sellerID: seller.sellerID }
                    },
                    workType: {
                        connect: { name: post.workType }
                    },
                    packages: {
                        createMany: {
                            data: [
                                {
                                    deliveryTime: post.packages[0].deliveryTime,
                                    revisions: post.packages[0].revisions,
                                    description: post.packages[0].description,
                                    features: post.packages[0].features,
                                    amount: post.packages[0].amount,
                                    type: post.packages[0].type,
                                    title: post.packages[0].title,
                                },
                                post.packages.length >= 2 ?
                                {
                                    deliveryTime: post.packages[1].deliveryTime,
                                    revisions: post.packages[1].revisions,
                                    description: post.packages[1].description,
                                    features: post.packages[1].features,
                                    amount: post.packages[1].amount,
                                    type: post.packages[1].type,
                                    title: post.packages[1].title,
                                } : undefined,
                                post.packages.length === 3 ?
                                {
                                    deliveryTime: post.packages[2].deliveryTime,
                                    revisions: post.packages[2].revisions,
                                    description: post.packages[2].description,
                                    features: post.packages[2].features,
                                    amount: post.packages[2].amount,
                                    type: post.packages[2].type,
                                    title: post.packages[2].title,
                                } : undefined
                            ].filter((x) => x != undefined)
                        }
                    }
                }
            });

            const uuid = uuidv4();
            const result = await uploadFile(req.file, `FreeFinder/PostImages/${res.postID}/${uuid}`, MAX_FILE_BYTES, true);

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
        }, {
            timeout: 10000
        });
    }
    catch (err) {
        if (err instanceof DBError) {
            throw err;
        } else if (err instanceof SyntaxError) {
            throw new DBError("Invalid JSON post data provided.", 400);
        } else if (err instanceof Prisma.PrismaClientValidationError) {
            throw new DBError("Missing required fields or fields provided are invalid.", 400);
        } else if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
            throw new DBError("Work type not found.", 404);
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
        const post = await prisma.post.findUnique({ 
            where: { postID: req.params.id },
            select: {
                postedBy: {
                    select: { userID: true }
                },
                _count: {
                    select: { images: true }
                }
            }
        });

        if (post == null) {
            throw new DBError("Service does not exist or has been deleted.", 404);
        } else if (req.userData.userID !== post.postedBy.userID) {
            throw new DBError("You are not authorized to delete this image.", 403);
        } else if (post._count.images === 1) {
            throw new DBError("You must have at least 1 image in your post.", 400);
        }

        return await prisma.$transaction(async (tx) => {
            await tx.postImage.delete({
                where: { 
                    cloudinaryID: req.params.cloudinaryID,
                    postID: req.params.id
                }
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
                    };
                })
            };
        });
    }
    catch (err) {
        if (err instanceof DBError) {
            throw err;
        } else if (err instanceof Prisma.PrismaClientKnownRequestError && err.code == "P2025") {
            throw new DBError("The cloudinary ID for this image is not associated with the provided service ID.", 403);
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
        const post = await prisma.post.findUnique({ 
            where: { postID: req.params.id },
            select: {
                postedBy: {
                    select: { userID: true }
                },
                _count: {
                    select: { images: true }
                }
            }
        });
        
        if (post == null) {
            throw new DBError("Service does not exist or has been deleted.", 404);
        } else if (req.userData.userID !== post.postedBy.userID) {
            throw new DBError("You are not authorized to add this image.", 403);
        } else if (post._count.images === MAX_SERVICE_IMAGE_UPLOADS) {
            throw new DBError(`You cannot have more than ${MAX_SERVICE_IMAGE_UPLOADS} images for one service.`, 400);
        } else if (req.file == null) {
            throw new DBError("Image file not specified.", 400);
        }

        const uuid = uuidv4();
        const result = await uploadFile(req.file, `FreeFinder/PostImages/${req.params.id}/${uuid}`, MAX_FILE_BYTES, true);
        const sizes = req.body.sizes ? typeof req.body.sizes === "string" ? JSON.parse(req.body.sizes) : req.body.sizes : undefined;

        if (sizes) {
            fs.appendFile('fileCompressionAnalysis.txt', `${sizes.oldSize},${sizes.newSize}\n`, (err) => {
                if (err) {
                    throw new DBError("Failed to add file sizes to file.", 500);
                }
            });
        }

        return await prisma.$transaction(async (tx) => {
            await tx.postImage.create({
                data: {
                    postID: req.params.id,
                    url: result.eager[0].secure_url,
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
                    };
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

        if (postData == null) {
            throw new DBError("Service does not exist or has been deleted.", 404);
        }
        
        return {
            ...postData,
            packages: postData.packages.map((pkg) => {
                return {
                    ...pkg,
                    amount: parseInt(pkg.amount)
                };
            })
        };
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
        prisma.$disconnect();
    }
}

function getSavedPostNotification(postID, seller, hidden) {
    if (hidden) {
        return {
            title: "A saved service has been hidden",
            text: `${seller} has temporarily hidden the sevice: ${postID}.`
        }
    } else {
        return {
            title: "A saved service has been unhidden",
            text: `${seller} has made the service: ${postID} publicly available!`
        }
    }
}

export async function updatePostHandler(req) {
    try {
        let update = {};
        if (req.body.update) {
            update = typeof req.body.update === "string" ? JSON.parse(req.body.update) : req.body.update;
        }

        const saved = await prisma.savedPost.findMany({
            where: { postID: req.params.id },
            select: { 
                user: { 
                    select: { 
                        socketID: true,
                        userID: true,
                        notificationSettings: true
                    }
                }
            }
        });

        return await prisma.$transaction(async (tx) => {
            if (req.file && req.body.imageURL) {
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
            
                if (image == null) {
                    throw new DBError("Image not found.", 404);
                } else if (req.userData.userID !== image.post.postedBy.userID) {
                    throw new DBError("You are not authorized to update this image.", 403);
                }
                
                const result = await uploadFile(
                    req.file, 
                    `FreeFinder/PostImages/${req.params.id}/${image.cloudinaryID}`, 
                    MAX_FILE_BYTES,
                    true
                );

                await tx.postImage.update({ 
                    where: {
                        postID_url: {
                            postID: req.params.id,
                            url: req.body.imageURL
                        }
                    },
                    data: {
                        url: result.secure_url
                    }
                });
            }

            const updatedPost = await tx.post.update({ 
                where: { postID: req.params.id },
                select: { ...postProperties },
                data: {
                    about: update.about,
                    title: update.title,
                    hidden: update.hidden
                }
            });

            const usersSaved = [];
            if (update.hidden !== undefined) {
                for (const savedPost of saved) {
                    if (savedPost.user.notificationSettings.savedServices !== false) {
                        const msg = getSavedPostNotification(updatedPost.postID, updatedPost.postedBy.user.username, update.hidden);
                        const notification = await tx.notification.create({
                            select: notificationProperties,
                            data: {
                                ...msg,
                                navigateTo: `/posts/${req.params.id}`,
                                userID: savedPost.user.userID
                            }
                        });

                        await tx.user.update({
                            where: { userID: savedPost.user.userID },
                            data: {
                                unreadNotifications: { increment: 1 }
                            }
                        });

                        if (savedPost.user.socketID) {
                            usersSaved.push({
                                socketID: savedPost.user.socketID,
                                notification: notification
                            });
                        }
                    }
                }
            }

            return {
                usersSaved: usersSaved,
                post: {
                    ...updatedPost,
                    packages: updatedPost.packages.map((pkg) => {
                        return {
                            ...pkg,
                            amount: parseInt(pkg.amount)
                        };
                    })
                }
            };
        }, {
            timeout: 10000
        });
    }
    catch (err) {
        if (err instanceof DBError) {
            throw err;
        } else if (err instanceof SyntaxError) {
            throw new DBError("Invalid post data JSON provided.", 400);
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
        const user = await prisma.user.findUnique({ 
            where: { userID: userID },
            select: {
                username: true,
                seller: {
                    select: {
                        sellerID: true
                    }
                }
            }
        });

        const post = await prisma.post.findUnique({ 
            where: { postID: postID }
        });
        
        if (user == null) {
            throw new DBError("User not found.", 404);
        } else if (post == null) {
            throw new DBError("Service does not exist or has been deleted.", 404);
        } else if (post.sellerID !== user.seller.sellerID) {
            throw new DBError("You do not have authorization to delete this post.", 403);
        }

        const usersSaved = [];
        const saved = await prisma.savedPost.findMany({
            where: { postID: postID },
            select: { 
                user: { 
                    select: { 
                        socketID: true,
                        userID: true,
                        notificationSettings: true
                    }
                }
            }
        });

        return await prisma.$transaction(async (tx) => {
            for (const savedPost of saved) {
                if (savedPost.user.notificationSettings.savedServices !== false) {
                    const notification = await tx.notification.create({
                        select: notificationProperties,
                        data: {
                            title: "One of your saved services has been removed",
                            text: `${user.username} has permanently removed the service: ${post.postID}.`,
                            userID: savedPost.user.userID
                        }
                    });
    
                    await tx.user.update({
                        where: { userID: savedPost.user.userID },
                        data: {
                            unreadNotifications: { increment: 1 }
                        }
                    });

                    if (savedPost.user.socketID) {
                        usersSaved.push({
                            socketID: savedPost.user.socketID,
                            notification: notification
                        });
                    }
                }
            }

            await tx.post.delete({ where: { postID: postID } });
            await deleteCloudinaryResource(`FreeFinder/PostImages/${postID}`, "image", true);
            return usersSaved;
        });
    }
    catch (err) {
        if (err instanceof DBError) {
            throw err;
        } else if (err instanceof Prisma.PrismaClientValidationError) {
            throw new DBError("Missing required fields or fields provided are invalid.", 400);
        } else if (err instanceof Prisma.PrismaClientKnownRequestError && (err.code == "P2025" || err.code === "P2003")) {
            if (err.code === "P2025") throw new DBError("Service does not exist or has been deleted.", 404);
            else throw new DBError("You must complete all remaining orders before deleting this service.", 400);
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
        
        const where = {
            ...getPostFilters(req),
            hidden: false
        };

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
            hidden: true,
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
            };
        });
    
        return {
            ...result,
            next: posts
        };
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

        if (sellerSummary == null) {
            throw new DBError("Service does not exist or has been deleted.", 404);
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
    finally {
        await prisma.$disconnect();
    }
}