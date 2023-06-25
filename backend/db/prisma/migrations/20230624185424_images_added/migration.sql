-- CreateTable
CREATE TABLE "PostImage" (
    "id" TEXT NOT NULL,
    "thumbnailPostID" TEXT,
    "postID" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "PostImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PostImage_thumbnailPostID_key" ON "PostImage"("thumbnailPostID");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_postID_fkey" FOREIGN KEY ("postID") REFERENCES "PostImage"("thumbnailPostID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostImage" ADD CONSTRAINT "PostImage_postID_fkey" FOREIGN KEY ("postID") REFERENCES "Post"("postID") ON DELETE CASCADE ON UPDATE CASCADE;
