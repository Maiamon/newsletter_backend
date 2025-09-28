-- CreateTable
CREATE TABLE "public"."_CategoryToUser" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CategoryToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CategoryToUser_B_index" ON "public"."_CategoryToUser"("B");

-- AddForeignKey
ALTER TABLE "public"."_CategoryToUser" ADD CONSTRAINT "_CategoryToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_CategoryToUser" ADD CONSTRAINT "_CategoryToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
