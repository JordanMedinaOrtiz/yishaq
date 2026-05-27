import { d as db, p as products, c as categories, s as sizes, b as productSizes } from '../../chunks/index_ThQEX7AB.mjs';
import { eq } from 'drizzle-orm';
export { renderers } from '../../renderers.mjs';

const GET = async ({ url }) => {
  try {
    const categorySlug = url.searchParams.get("category");
    const featured = url.searchParams.get("featured");
    let allProducts = await db.select({
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
      isActive: products.isActive
    }).from(products).where(eq(products.isActive, true));
    if (categorySlug) {
      const [category] = await db.select().from(categories).where(eq(categories.slug, categorySlug));
      if (category) {
        allProducts = allProducts.filter((p) => p.categoryId === category.id);
      }
    }
    if (featured === "true") {
      allProducts = allProducts.filter((p) => p.featured === true);
    }
    const productsWithSizes = await Promise.all(
      allProducts.map(async (product) => {
        const productSizeRecords = await db.select({
          sizeName: sizes.name
        }).from(productSizes).innerJoin(sizes, eq(productSizes.sizeId, sizes.id)).where(eq(productSizes.productId, product.id));
        const sizeNames = productSizeRecords.map((ps) => ps.sizeName);
        const [category] = await db.select({ name: categories.name }).from(categories).where(eq(categories.id, product.categoryId));
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
          featured: product.featured === true
        };
      })
    );
    return new Response(
      JSON.stringify({
        success: true,
        products: productsWithSizes,
        count: productsWithSizes.length
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    console.error("Error obteniendo productos:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Error al obtener productos"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
