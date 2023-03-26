-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ONLINE', 'OFFLINE');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('COMPLETED', 'PENDING', 'CANCELLED');

-- CreateTable
CREATE TABLE "User" (
    "userID" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "salt" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "memberDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "UserStatus" NOT NULL,
    "profilePicURL" TEXT,
    "email" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userID")
);

-- CreateTable
CREATE TABLE "Seller" (
    "sellerID" TEXT NOT NULL,
    "userID" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Seller_pkey" PRIMARY KEY ("sellerID")
);

-- CreateTable
CREATE TABLE "SavedPost" (
    "postID" TEXT NOT NULL,
    "userID" TEXT NOT NULL,

    CONSTRAINT "SavedPost_pkey" PRIMARY KEY ("userID","postID")
);

-- CreateTable
CREATE TABLE "Post" (
    "postID" TEXT NOT NULL,
    "sellerID" TEXT NOT NULL,
    "about" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "thumbnailPicURL" TEXT,
    "title" TEXT NOT NULL,
    "startingPrice" MONEY NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("postID")
);

-- CreateTable
CREATE TABLE "Review" (
    "reviewID" TEXT NOT NULL,
    "sellerID" TEXT NOT NULL,
    "reviewerID" TEXT NOT NULL,
    "reviewBody" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rating" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("reviewID")
);

-- CreateTable
CREATE TABLE "Order" (
    "orderID" TEXT NOT NULL,
    "customerID" TEXT NOT NULL,
    "sellerID" TEXT NOT NULL,
    "postID" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "orderAmount" MONEY NOT NULL,
    "status" "OrderStatus" NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("orderID")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Seller_userID_key" ON "Seller"("userID");

-- AddForeignKey
ALTER TABLE "Seller" ADD CONSTRAINT "Seller_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedPost" ADD CONSTRAINT "SavedPost_postID_fkey" FOREIGN KEY ("postID") REFERENCES "Post"("postID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedPost" ADD CONSTRAINT "SavedPost_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_sellerID_fkey" FOREIGN KEY ("sellerID") REFERENCES "Seller"("sellerID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_sellerID_fkey" FOREIGN KEY ("sellerID") REFERENCES "Seller"("sellerID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_reviewerID_fkey" FOREIGN KEY ("reviewerID") REFERENCES "User"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_customerID_fkey" FOREIGN KEY ("customerID") REFERENCES "User"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_sellerID_fkey" FOREIGN KEY ("sellerID") REFERENCES "Seller"("sellerID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_postID_fkey" FOREIGN KEY ("postID") REFERENCES "Post"("postID") ON DELETE RESTRICT ON UPDATE CASCADE;
