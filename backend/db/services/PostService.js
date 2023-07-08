import { Prisma } from '@prisma/client';
import { findSeller } from './SellerService.js';
import { DBError } from "../customErrors/DBError.js";
import { deleteCloudinaryResource } from '../utils/deleteCloudinaryResource.js';
import { cloudinary } from '../index.js';
import { prisma } from '../index.js';
import { v4 as uuidv4 } from 'uuid';
import { paginationLimit } from '../index.js';
import { sortPosts } from '../utils/sortPosts.js';
import { getPostsCount } from '../utils/getPostsCount.js';
import { getPostFilters } from '../utils/getPostFilters.js';

async function uploadImage(postID, image, url, isThumbnail) {
    const result = await new Promise(async (resolve, reject) => {
        const upload = cloudinary.uploader.upload(image, { public_id: url }, (err, result) => {
            if (err) {
                reject(new DBError(err.message, err.http_code));
            } else {
                resolve(result);
            }
        });

        const success = await upload.then((data) => data);
        return success;
    });

    await prisma.postImage.create({
        data: {
            postID: postID,
            url: result.secure_url,
            isThumbnail: isThumbnail
        }
    });
}

export async function createPostHandler(postData, startingPrice, userID) {
    try {
        const seller = await findSeller(userID);
        if (seller._count.posts === seller.sellerLevel.postLimit) {
            throw new DBError(`You have ${seller._count.posts} posts listed on your account which is the maximum amount for your current experience level.`, 403);
        }

        const res = await prisma.post.create({
            data: {
                about: postData.about,
                title: postData.title,
                startingPrice: startingPrice,
                sellerID: seller.sellerID
            },
            select: {
                postID: true
            }
        });

        await uploadImage(res.postID, postData.thumbnail, `FreeFinder/PostImages/${userID}/${res.postID}/${uuidv4()}`, true);
        await createPostPackage(postData.packages[0], res.postID, postData.packages[0].type);

        if (postData.packages.length >= 2) {
            await createPostPackage(postData.packages[1], res.postID, postData.packages[1].type);
        }

        if (postData.packages.length === 3) {
            await createPostPackage(postData.packages[2], res.postID, postData.packages[2].type);
        }

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

export async function addImageHandler(req) {
    try {
        const post = await prisma.post.findUnique({ 
            where: { 
                postID: req.params.id 
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

        if (req.userData.userID !== post.postedBy.userID) {
            throw new DBError("You are not authorized to add an image to this post.", 403);
        }

        await uploadImage(
            req.params.id,
            req.body.image, 
            `FreeFinder/PostImages/${req.userData.userID}/${req.params.id}/${uuidv4()}`, 
            false);
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

export async function createPostPackage(packageData, postID, type) {
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
        if (err instanceof DBError) {
            throw err;
        }  else if (err instanceof Prisma.PrismaClientValidationError) {
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
            select: {
                postedBy: {
                    select: {
                        user: {
                            select: {
                                username: true,
                                country: true,
                                memberDate: true,
                                status: true,
                                profilePicURL: true,
                            }
                        },
                        rating: true,
                        description: true,
                        summary: true,
                        _count: {
                            select: { 
                                reviews: true
                            }
                        },
                        languages: true,
                        skills: true,
                        sellerLevel: {
                            select: {
                                name: true,
                            }
                        }
                    },
                },
                packages: {
                    select: {
                        deliveryTime: true,
                        revisions: true,
                        description: true,
                        amount: true,
                        type: true,
                        features: true,
                        numOrders: true,
                        title: true
                    }
                },
                images: {
                    select: {
                        url: true,
                        isThumbnail: true
                    },
                    orderBy: {
                        isThumbnail: 'desc'
                    }
                },
                title: true,
                createdAt: true,
                about: true,
                sellerID: true,
                postID: true
            }
        });
        
        return postData;
    }
    catch (err) {
        if (err instanceof DBError) {
            throw err;
        } else if (err instanceof Prisma.PrismaClientValidationError) {
            throw new DBError("Missing required fields or fields provided are invalid.", 400);
        } else {
            throw new DBError("Something went wrong when trying to get this post. Please try again.", 500);
        }
    }
    finally {
        prisma.$disconnect();
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
        
        await deleteCloudinaryResource(`FreeFinder/PostImages/${userID}/${postID}`, "folder");
        await prisma.post.delete({ where: { postID: postID } });
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
        if (err instanceof DBError) {
            throw err;
        } else if (err instanceof Prisma.PrismaClientValidationError) {
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
    const posts = await prisma.post.findMany({
        skip: req.body.cursor ? 1 : undefined,
        cursor: req.body.cursor ? { postID: req.body.cursor } : undefined,
        take: paginationLimit,
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
                    isThumbnail: true
                },
                orderBy: {
                    isThumbnail: 'desc'
                }
            }
        }
    });

    const count = req.body.cursor ? 0 : await getPostsCount(postFilters);
    if (posts.length === 0) {
        return { 
            posts: posts, 
            cursor: undefined, 
            last: true,
            count: count
        };
    }

    const minNum = Math.min(paginationLimit - 1, posts.length - 1);
    return { 
        posts: posts, 
        cursor: posts[minNum].postID,
        last: minNum < paginationLimit - 1,
        count: count
    };
}