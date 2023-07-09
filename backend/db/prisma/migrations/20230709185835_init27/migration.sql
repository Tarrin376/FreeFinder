-- CreateTable
CREATE TABLE "SavedSeller" (
    "sellerID" TEXT NOT NULL,
    "userID" TEXT NOT NULL,

    CONSTRAINT "SavedSeller_pkey" PRIMARY KEY ("userID","sellerID")
);

-- AddForeignKey
ALTER TABLE "SavedSeller" ADD CONSTRAINT "SavedSeller_sellerID_fkey" FOREIGN KEY ("sellerID") REFERENCES "Seller"("sellerID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedSeller" ADD CONSTRAINT "SavedSeller_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE CASCADE ON UPDATE CASCADE;
