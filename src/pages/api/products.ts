/**
 * API Endpoint: Obtener Productos
 * GET /api/products
 *
 * Retorna todos los productos activos de la base de datos
 */

import type { APIRoute } from "astro";
import { db, products, categories, productSizes, sizes } from "../../db";
import { eq, and } from "drizzle-orm";

export const GET: APIRoute = async ({ url }) => {
  try {
    const categorySlug = url.searchParams.get("category");
    const featured = url.searchParams.get("featured");

    // Obtener todos los productos activos
    let allProducts = db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        description: products.description,
        price: products.price,
        compareAtPrice: products.compareAtPrice,
        imageUrl: products.imageUrl,
        images: products.images,
        categoryId: products.categoryId,
        stock: products.stock,
        featured: products.featured,
        isActive: products.isActive,
      })
      .from(products)
      .where(eq(products.isActive, true))
      .all();

    // Filtrar por categoría si se especifica
    if (categorySlug) {
      const category = db
        .select()
        .from(categories)
        .where(eq(categories.slug, categorySlug))
        .get();

      if (category) {
        allProducts = allProducts.filter((p) => p.categoryId === category.id);
      }
    }

    // Filtrar por featured si se especifica
    if (featured === "true") {
      allProducts = allProducts.filter((p) => p.featured === true);
    }

    // Obtener las tallas para cada producto
    const productsWithSizes = allProducts.map((product) => {
      const productSizeRecords = db
        .select({
          sizeName: sizes.name,
        })
        .from(productSizes)
        .innerJoin(sizes, eq(productSizes.sizeId, sizes.id))
        .where(eq(productSizes.productId, product.id))
        .all();

      const sizeNames = productSizeRecords.map((ps) => ps.sizeName);

      // Obtener nombre de categoría
      const category = db
        .select({ name: categories.name })
        .from(categories)
        .where(eq(categories.id, product.categoryId))
        .get();

      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        image: product.imageUrl,
        images: product.images || [],
        category: category?.name || "Sin categoría",
        categoryId: product.categoryId,
        sizes: sizeNames.length > 0 ? sizeNames : ["S", "M", "L", "XL"],
        stock: product.stock,
        featured: product.featured === true,
      };
    });

    return new Response(
      JSON.stringify({
        success: true,
        products: productsWithSizes,
        count: productsWithSizes.length,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error obteniendo productos:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Error al obtener productos",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
