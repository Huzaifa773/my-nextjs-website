import { PrismaClient, FragranceType, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Demo credentials are read from env so nothing real is hard-coded.
// Falls back to clearly-marked placeholders if .env is not configured yet.
const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || "admin@demo-perfume.test";
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || "ChangeMe123!";
const CUSTOMER_EMAIL = process.env.SEED_CUSTOMER_EMAIL || "customer@demo-perfume.test";
const CUSTOMER_PASSWORD = process.env.SEED_CUSTOMER_PASSWORD || "ChangeMe123!";

async function main() {
  console.log("Seeding database...");

  // ---------------- Categories ----------------
  const categoryData = [
    { name: "Men's Perfumes", slug: "mens-perfumes", description: "Bold, timeless scents crafted for men." },
    { name: "Women's Perfumes", slug: "womens-perfumes", description: "Elegant, refined fragrances for women." },
    { name: "Unisex Perfumes", slug: "unisex-perfumes", description: "Fragrances designed to be worn by anyone." },
    { name: "Oud", slug: "oud", description: "Rich, woody oud-based fragrances." },
    { name: "Attar", slug: "attar", description: "Alcohol-free traditional concentrated oils." },
    { name: "Gift Sets", slug: "gift-sets", description: "Curated fragrance sets, perfect for gifting." },
    { name: "Premium Collection", slug: "premium-collection", description: "Our most luxurious, limited fragrances." },
    { name: "New Arrivals", slug: "new-arrivals", description: "The latest additions to our catalog." },
  ];

  const categories: Record<string, string> = {};
  for (const c of categoryData) {
    const cat = await prisma.category.upsert({
      where: { slug: c.slug },
      update: {},
      create: c,
    });
    categories[c.slug] = cat.id;
  }

  // ---------------- Products ----------------
  const products = [
    {
      name: "Noir Absolu",
      slug: "noir-absolu",
      description: "A deep, smoky blend of oud, amber and dark spices for the evening.",
      price: 18500,
      discountPrice: 15900,
      brand: "Maison Charcoal",
      size: "100ml",
      fragranceType: FragranceType.EAU_DE_PARFUM,
      sku: "PF-NOIR-100",
      stock: 40,
      isFeatured: true,
      isBestSeller: true,
      categorySlug: "mens-perfumes",
      images: ["https://images.unsplash.com/photo-1592945403244-b3fbafd7f539"],
    },
    {
      name: "Golden Iris",
      slug: "golden-iris",
      description: "Powdery iris and champagne accord wrapped in warm vanilla.",
      price: 21000,
      discountPrice: null,
      brand: "Maison Charcoal",
      size: "50ml",
      fragranceType: FragranceType.EAU_DE_PARFUM,
      sku: "PF-IRIS-50",
      stock: 25,
      isFeatured: true,
      isNewArrival: true,
      categorySlug: "womens-perfumes",
      images: ["https://images.unsplash.com/photo-1587017539504-67cfbddac569"],
    },
    {
      name: "Velvet Oud Royale",
      slug: "velvet-oud-royale",
      description: "Premium Cambodian oud layered with saffron and rose.",
      price: 34500,
      discountPrice: 29900,
      brand: "Oud Heritage",
      size: "50ml",
      fragranceType: FragranceType.PARFUM_EXTRAIT,
      sku: "PF-OUDR-50",
      stock: 15,
      isFeatured: true,
      isBestSeller: true,
      categorySlug: "oud",
      images: ["https://images.unsplash.com/photo-1615368144592-0e5f56ec1a68"],
    },
    {
      name: "Musk Al Ameer Attar",
      slug: "musk-al-ameer-attar",
      description: "Traditional alcohol-free white musk attar oil.",
      price: 8900,
      discountPrice: null,
      brand: "Al Ameer",
      size: "12ml",
      fragranceType: FragranceType.ATTAR,
      sku: "PF-ATTAR-12",
      stock: 60,
      isNewArrival: true,
      categorySlug: "attar",
      images: ["https://images.unsplash.com/photo-1592945403244-b3fbafd7f539"],
    },
    {
      name: "Citrus Neutral",
      slug: "citrus-neutral",
      description: "Fresh bergamot and white tea, light enough for daily wear by anyone.",
      price: 12500,
      discountPrice: 10900,
      brand: "Maison Charcoal",
      size: "100ml",
      fragranceType: FragranceType.EAU_DE_TOILETTE,
      sku: "PF-CIT-100",
      stock: 55,
      isBestSeller: true,
      categorySlug: "unisex-perfumes",
      images: ["https://images.unsplash.com/photo-1541643600914-78b084683601"],
    },
    {
      name: "Royal Duo Gift Set",
      slug: "royal-duo-gift-set",
      description: "A matching his-and-hers 50ml gift set in a satin box.",
      price: 27500,
      discountPrice: 24900,
      brand: "Maison Charcoal",
      size: "2 x 50ml",
      fragranceType: FragranceType.EAU_DE_PARFUM,
      sku: "PF-GIFT-02",
      stock: 20,
      isFeatured: true,
      categorySlug: "gift-sets",
      images: ["https://images.unsplash.com/photo-1523293182086-7651a899d37f"],
    },
    {
      name: "Amber Nocturne",
      slug: "amber-nocturne",
      description: "Smoky amber, tobacco leaf and dark chocolate for cold nights.",
      price: 19800,
      discountPrice: null,
      brand: "Noir House",
      size: "75ml",
      fragranceType: FragranceType.EAU_DE_PARFUM,
      sku: "PF-AMBN-75",
      stock: 30,
      isBestSeller: true,
      categorySlug: "mens-perfumes",
      images: ["https://images.unsplash.com/photo-1594035910387-fea47794261f"],
    },
    {
      name: "Rose Cashmere",
      slug: "rose-cashmere",
      description: "Turkish rose petals blended into soft cashmere musk.",
      price: 23500,
      discountPrice: 19900,
      brand: "Maison Charcoal",
      size: "50ml",
      fragranceType: FragranceType.EAU_DE_PARFUM,
      sku: "PF-ROSE-50",
      stock: 18,
      isFeatured: true,
      categorySlug: "womens-perfumes",
      images: ["https://images.unsplash.com/photo-1615634260167-c8cdede054de"],
    },
    {
      name: "Sultan's Oud Extrait",
      slug: "sultans-oud-extrait",
      description: "Our most concentrated, longest-lasting oud extrait — limited batch.",
      price: 45900,
      discountPrice: null,
      brand: "Oud Heritage",
      size: "30ml",
      fragranceType: FragranceType.PARFUM_EXTRAIT,
      sku: "PF-SULT-30",
      stock: 8,
      isFeatured: true,
      categorySlug: "premium-collection",
      images: ["https://images.unsplash.com/photo-1592945403244-b3fbafd7f539"],
    },
    {
      name: "Fresh Linen Mist",
      slug: "fresh-linen-mist",
      description: "A light body mist with notes of clean cotton and white musk.",
      price: 6900,
      discountPrice: 5900,
      brand: "Everyday Co.",
      size: "150ml",
      fragranceType: FragranceType.BODY_MIST,
      sku: "PF-LINEN-150",
      stock: 80,
      isNewArrival: true,
      categorySlug: "unisex-perfumes",
      images: ["https://images.unsplash.com/photo-1596462502278-27bfdc403348"],
    },
    {
      name: "Saffron Oud Attar",
      slug: "saffron-oud-attar",
      description: "Deep saffron threads infused into pure oud oil, alcohol-free.",
      price: 14900,
      discountPrice: null,
      brand: "Al Ameer",
      size: "12ml",
      fragranceType: FragranceType.ATTAR,
      sku: "PF-SAFF-12",
      stock: 35,
      isNewArrival: true,
      categorySlug: "attar",
      images: ["https://images.unsplash.com/photo-1615368144592-0e5f56ec1a68"],
    },
    {
      name: "Jasmine Nightfall",
      slug: "jasmine-nightfall",
      description: "Heady jasmine sambac balanced with soft sandalwood.",
      price: 20500,
      discountPrice: 17900,
      brand: "Noir House",
      size: "75ml",
      fragranceType: FragranceType.EAU_DE_PARFUM,
      sku: "PF-JASM-75",
      stock: 22,
      isBestSeller: true,
      categorySlug: "womens-perfumes",
      images: ["https://images.unsplash.com/photo-1587017539504-67cfbddac569"],
    },
  ];

  for (const p of products) {
    const { categorySlug, images, ...data } = p;
    const product = await prisma.product.upsert({
      where: { sku: data.sku },
      update: {},
      create: {
        ...data,
        categoryId: categories[categorySlug],
      },
    });

    for (let i = 0; i < images.length; i++) {
      await prisma.productImage.upsert({
        where: { id: `${product.id}-seed-${i}` },
        update: {},
        create: {
          id: `${product.id}-seed-${i}`,
          productId: product.id,
          url: `${images[i]}?w=800&q=80&auto=format`,
          altText: product.name,
          position: i,
        },
      });
    }
  }

  // ---------------- Users ----------------
  const adminPasswordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
  const admin = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {},
    create: {
      name: "Store Admin",
      email: ADMIN_EMAIL,
      passwordHash: adminPasswordHash,
      role: Role.ADMIN,
      phone: "+92 300 0000000",
    },
  });

  const customerPasswordHash = await bcrypt.hash(CUSTOMER_PASSWORD, 12);
  const customer = await prisma.user.upsert({
    where: { email: CUSTOMER_EMAIL },
    update: {},
    create: {
      name: "Demo Customer",
      email: CUSTOMER_EMAIL,
      passwordHash: customerPasswordHash,
      role: Role.CUSTOMER,
      phone: "+92 300 1111111",
    },
  });

  // Give the demo customer a cart, wishlist and one saved address
  await prisma.cart.upsert({
    where: { userId: customer.id },
    update: {},
    create: { userId: customer.id },
  });

  await prisma.wishlist.upsert({
    where: { userId: customer.id },
    update: {},
    create: { userId: customer.id },
  });

  const existingAddress = await prisma.address.findFirst({ where: { userId: customer.id } });
  if (!existingAddress) {
    await prisma.address.create({
      data: {
        userId: customer.id,
        fullName: "Demo Customer",
        phone: "+92 300 1111111",
        line1: "123 Clifton Block 5",
        city: "Karachi",
        province: "Sindh",
        postalCode: "75600",
        country: "Pakistan",
        isDefault: true,
      },
    });
  }

  console.log("Seed complete.");
  console.log("----------------------------------------------------");
  console.log(`Admin login:    ${ADMIN_EMAIL} / (password from SEED_ADMIN_PASSWORD in .env)`);
  console.log(`Customer login: ${CUSTOMER_EMAIL} / (password from SEED_CUSTOMER_PASSWORD in .env)`);
  console.log("These are demo credentials only — change them before any public deployment.");
  console.log("----------------------------------------------------");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
