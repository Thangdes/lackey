-- CreateEnum
CREATE TYPE "public"."ContentType" AS ENUM ('BANNER', 'TESTIMONIAL');

-- CreateTable
CREATE TABLE "public"."site_content" (
    "id" TEXT NOT NULL,
    "type" "public"."ContentType" NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "content" TEXT,
    "thumbnail_url" VARCHAR(255),
    "link_url" VARCHAR(255),
    "author_name" VARCHAR(100),
    "author_title" VARCHAR(100),
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_content_pkey" PRIMARY KEY ("id")
);
