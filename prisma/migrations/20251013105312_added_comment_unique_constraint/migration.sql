/*
  Warnings:

  - A unique constraint covering the columns `[id,postId]` on the table `comments` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "comments_id_postId_key" ON "comments"("id", "postId");
