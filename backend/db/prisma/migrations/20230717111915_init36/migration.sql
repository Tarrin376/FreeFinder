-- CreateTable
CREATE TABLE "_FoundHelpful" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_FoundHelpful_AB_unique" ON "_FoundHelpful"("A", "B");

-- CreateIndex
CREATE INDEX "_FoundHelpful_B_index" ON "_FoundHelpful"("B");

-- AddForeignKey
ALTER TABLE "_FoundHelpful" ADD CONSTRAINT "_FoundHelpful_A_fkey" FOREIGN KEY ("A") REFERENCES "Review"("reviewID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FoundHelpful" ADD CONSTRAINT "_FoundHelpful_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("userID") ON DELETE CASCADE ON UPDATE CASCADE;
