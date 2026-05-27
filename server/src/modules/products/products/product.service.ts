import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@/infrastructure/database/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductVariantDto } from './dto/product-variant.dto';
import { UpdateProductVariantDto } from './dto/update-product-variant.dto';
import { CloudinaryService } from '@/integrations/cloudinary/cloudinary.service';
import { ProductCalculatorUtil } from './utilities/product-calculator.util';

@Injectable()
export class ProductService {
  constructor(
    private prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const { variants, categoryId, supplierId, ...productData } = createProductDto;
    const existingProduct = await this.prisma.product.findUnique({
      where: { slug: productData.slug },
    });
    if (existingProduct) {
      throw new ConflictException(
        `Product with slug '${productData.slug}' already exists.`,
      );
    }
    await this.prisma.category
      .findUniqueOrThrow({
        where: { id: categoryId },
      })
      .catch(() => {
        throw new NotFoundException(
          `Category with ID '${categoryId}' not found.`,
        );
      });
    await this.prisma.supplier
      .findUniqueOrThrow({
        where: { id: supplierId },
      })
      .catch(() => {
        throw new NotFoundException(
          `Supplier with ID '${supplierId}' not found.`,
        );
      });
    return this.prisma.product.create({
      data: {
        ...productData,
        category: { connect: { id: categoryId } },
        supplier: { connect: { id: supplierId } },
        variants: {
          create: variants,
        },
      },
      include: { variants: true },
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        supplier: { select: { id: true, name: true, email: true, phone: true, address: true, description: true, contactName: true } },
        variants: true,
      },
    });
    if (!product) {
      throw new NotFoundException(`Product with ID '${id}' not found`);
    }
    return ProductCalculatorUtil.enrichProductWithCalculatedFields(product);
  }

  async findBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        supplier: { select: { id: true, name: true, email: true, phone: true, address: true, description: true, contactName: true } },
        variants: true,
      },
    });
    if (!product) {
      throw new NotFoundException(`Product with slug '${slug}' not found`);
    }
    return ProductCalculatorUtil.enrichProductWithCalculatedFields(product);
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const { variants, ...productData } = updateProductDto;
    return this.prisma.$transaction(async (tx) => {
      await tx.product.update({
        where: { id },
        data: productData,
      });
      if (variants) {
        const existingVariants = await tx.productVariant.findMany({
          where: { productId: id },
          select: { id: true },
        });
        const existingVariantIds = new Set(existingVariants.map((v) => v.id));
        const variantsToCreate = variants.filter((v) => !v.id);
        const variantsToUpdate = variants.filter(
          (v) => v.id && existingVariantIds.has(v.id),
        );
        const variantIdsToUpdate = new Set(variantsToUpdate.map((v) => v.id));
        const variantIdsToDelete = [...existingVariantIds].filter(
          (id) => !variantIdsToUpdate.has(id),
        );
        if (variantsToCreate.length > 0) {
          await tx.productVariant.createMany({
            data: variantsToCreate.map((v) => ({ ...v, productId: id })),
          });
        }
        for (const variant of variantsToUpdate) {
          await tx.productVariant.update({
            where: { id: variant.id },
            data: variant,
          });
        }
        if (variantIdsToDelete.length > 0) {
          const referencedCount = await tx.orderItem.count({
            where: { productVariantId: { in: variantIdsToDelete } },
          });
          if (referencedCount > 0) {
            throw new ConflictException(
              'Cannot delete one or more variants because they are associated with existing orders.',
            );
          }
          await tx.productVariant.deleteMany({
            where: { id: { in: variantIdsToDelete } },
          });
        }
      }
      return tx.product.findUnique({
        where: { id },
        include: { variants: true },
      });
    });
  }

  async updateThumbnail(productId: string, thumbnailFile: Express.Multer.File) {
    const product = await this.findOne(productId);
    const uploadResult = await this.cloudinaryService.uploadFile(thumbnailFile);
    if (product.thumbnailUrl) {
      try {
        const publicId = product.thumbnailUrl.split('/').pop().split('.')[0];
        await this.cloudinaryService.deleteFile(`folder_name/${publicId}`);
      } catch (error) {
        console.error('Failed to delete old thumbnail:', error);
      }
    }
    return this.prisma.product.update({
      where: { id: productId },
      data: {
        thumbnailUrl: uploadResult.secure_url,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    // Prevent deleting a product if any of its variants are referenced by order items
    const orderItemsCount = await this.prisma.orderItem.count({
      where: { productVariant: { productId: id } },
    });

    if (orderItemsCount > 0) {
      throw new ConflictException(
        'Cannot delete product because one or more variants are associated with existing orders.',
      );
    }

    return this.prisma.product.delete({
      where: { id },
    });
  }
  
  async findAllVariants(productId: string) {
    await this.findOne(productId);
    return this.prisma.productVariant.findMany({
      where: { productId },
      orderBy: { name: 'asc' },
    });
  }
  
  async addVariant(productId: string, variantData: ProductVariantDto) {
    await this.findOne(productId);
    const existingSku = await this.prisma.productVariant.findUnique({
      where: { sku: variantData.sku },
    });
    if (existingSku) {
      throw new ConflictException(`SKU '${variantData.sku}' already exists.`);
    }

    return this.prisma.productVariant.create({
      data: {
        ...variantData,
        productId,
      },
    });
  }
  
  async updateVariant(
    productId: string,
    variantId: string,
    variantData: UpdateProductVariantDto,
  ) {
    const variant = await this.prisma.productVariant
      .findFirstOrThrow({
        where: {
          id: variantId,
          productId: productId,
        },
      })
      .catch(() => {
        throw new NotFoundException(
          `Variant with ID '${variantId}' not found on product '${productId}'`,
        );
      });
    if (variantData.sku && variantData.sku !== variant.sku) {
      const existingSku = await this.prisma.productVariant.findUnique({
        where: { sku: variantData.sku },
      });
      if (existingSku) {
        throw new ConflictException(`SKU '${variantData.sku}' already exists.`);
      }
    }

    return this.prisma.productVariant.update({
      where: { id: variantId },
      data: variantData,
    });
  }
  
  async removeVariant(productId: string, variantId: string) {
    await this.prisma.productVariant
      .findFirstOrThrow({
        where: {
          id: variantId,
          productId: productId,
        },
      })
      .catch(() => {
        throw new NotFoundException(
          `Variant with ID '${variantId}' not found on product '${productId}'`,
        );
      });
    const orderItemsCount = await this.prisma.orderItem.count({
      where: { productVariantId: variantId },
    });

    if (orderItemsCount > 0) {
      throw new ConflictException(
        'Cannot delete variant because it is associated with existing orders.',
      );
    }

    return this.prisma.productVariant.delete({
      where: { id: variantId },
    });
  }

  async addImages(productId: string, files: Express.Multer.File[]) {
    const product = await this.findOne(productId);
    const uploadPromises = files.map((file) =>
      this.cloudinaryService.uploadFile(file),
    );
    const uploadResults = await Promise.all(uploadPromises);
    const imageUrls = uploadResults.map((result) => result.secure_url);
    const updatedImages = [...product.images, ...imageUrls];
    return this.prisma.product.update({
      where: { id: productId },
      data: {
        images: updatedImages,
      },
    });
  }

  async removeImage(productId: string, imageUrl: string) {
    const product = await this.findOne(productId);

    if (!product.images.includes(imageUrl)) {
      return product;
    }

    try {
      const publicId = imageUrl.split('/').pop().split('.')[0];
      await this.cloudinaryService.deleteFile(`folder_name/${publicId}`);
    } catch (error) {
      console.error('Failed to delete image from Cloudinary:', error);
    }

    const updatedImages = product.images.filter((img) => img !== imageUrl);

    return this.prisma.product.update({
      where: { id: productId },
      data: {
        images: updatedImages,
      },
    });
  }
}
