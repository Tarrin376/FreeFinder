-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_workTypeID_fkey";

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_workTypeID_fkey" FOREIGN KEY ("workTypeID") REFERENCES "WorkType"("id") ON DELETE CASCADE ON UPDATE CASCADE;
