import { Prisma } from '@prisma/client';
import { prisma } from './UserService.js';
import { findSeller } from './SellerService.js';
import { DBError } from "../customErrors/DBError.js";
import { cloudinary } from './UserService.js';

export async function createPostHandler(postData, startingPrice, userID) {
    try {
        const seller = await findSeller(userID);
        const res = await prisma.post.create({
            data: {
                about: postData.about,
                title: postData.title,
                startingPrice: startingPrice,
                sellerID: seller.sellerID
            }
        });

        const upload = cloudinary.uploader.upload(postData.thumbnail, { public_id: `FreeFinder/PostImages/${userID}-0` });
        const success = await upload.then((data) => data);

        await prisma.postImage.create({
            data: {
                url: success.secure_url,
                postID: res.postID
            }
        });

        createPostPackage(postData.packages[0], res.postID, postData.packages[0].type);
        if (postData.packages.length >= 2) createPostPackage(postData.packages[1], res.postID, postData.packages[1].type);
        if (postData.packages.length === 3) createPostPackage(postData.packages[2], res.postID, postData.packages[2].type);
        return res.postID;
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
            include: {
                postedBy: true
            }
        });
        
        if (!post) {
            throw new DBError("Post not found.", 404);
        }

        if (req.userData.userID !== post.postedBy.userID) {
            throw new DBError("You are not authorized to add an image to this post.", 403);
        }

        if (req.body.imageNum === undefined) {
            throw new DBError("Image number not specified.", 400);
        }

        const upload = cloudinary.uploader.upload(req.body.image, { public_id: `FreeFinder/PostImages/${req.userData.userID}-${req.body.imageNum}` });
        const success = await upload.then((data) => data);

        await prisma.postImage.create({
            data: {
                postID: req.params.id,
                url: success.secure_url,
                imageNum: req.body.imageNum
            }
        });
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
                packageTitle: packageData.packageTitle,
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
            include: {
                postedBy: {
                    include: {
                        user: {
                            select: {
                                username: true,
                                country: true,
                                memberDate: true,
                                status: true,
                                profilePicURL: true,
                            }
                        },
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
                        packageTitle: true
                    }
                },
                images: {
                    orderBy: {
                        imageNum: 'asc'
                    }
                }
            }
        });
        
        const { userID, sellerID, ...postedBy } = postData.postedBy;
        return { ...postData, postedBy };
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
            include: {
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
        } else {
            await prisma.post.delete({ where: { postID: postID } });
        }
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