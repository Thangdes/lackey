/*
  Warnings:

  - A unique constraint covering the columns `[customer_id,product_variant_id]` on the table `cart_items` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[guest_cart_id,product_variant_id]` on the table `cart_items` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."cart_items_guest_cart_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "cart_items_customer_id_product_variant_id_key" ON "public"."cart_items"("customer_id", "product_variant_id");

-- CreateIndex
CREATE UNIQUE INDEX "cart_items_guest_cart_id_product_variant_id_key" ON "public"."cart_items"("guest_cart_id", "product_variant_id");
