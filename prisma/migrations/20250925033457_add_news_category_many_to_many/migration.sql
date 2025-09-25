/*
  Warnings:

  - You are about to drop the column `newsId` on the `categories` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."categories" DROP CONSTRAINT "categories_newsId_fkey";

-- AlterTable
ALTER TABLE "public"."categories" DROP COLUMN "newsId";

-- CreateTable
CREATE TABLE "public"."_CategoryToNews" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_CategoryToNews_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CategoryToNews_B_index" ON "public"."_CategoryToNews"("B");

-- AddForeignKey
ALTER TABLE "public"."_CategoryToNews" ADD CONSTRAINT "_CategoryToNews_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_CategoryToNews" ADD CONSTRAINT "_CategoryToNews_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."news"("id") ON DELETE CASCADE ON UPDATE CASCADE;
