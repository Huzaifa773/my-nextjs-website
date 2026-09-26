# Perfume Store — Stage 1 (Scaffold, Database, Seed)

This is Stage 1 of the build: project scaffold, environment config, complete
Prisma/MySQL schema, and seed data. Pages, API routes, auth wiring and the
UI come in the following stages.

## What's included in Stage 1

- `package.json`, `tsconfig.json`, `next.config.js`, `tailwind.config.ts`, `postcss.config.js`
- `.env.example` — database, NextAuth, and all payment-gateway variables
- `prisma/schema.prisma` — every model and relationship from the spec
- `prisma/seed.ts` — 8 categories, 12 products, 1 admin, 1 demo customer
- `lib/prisma.ts`, `lib/utils.ts`

## 1. Install MySQL and create the database (Windows)

If you don't already have MySQL running, install MySQL Community Server,
then open **MySQL Command Line Client** (or `cmd`) and run:

```bash
mysql -u root -p
```

Then inside the MySQL prompt:

```sql
CREATE DATABASE perfume_store CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

## 2. Configure environment variables

Copy `.env.example` to `.env`:

```bash
copy .env.example .env
```

Open `.env` and edit this line with **your own** MySQL username, password,
and the database name you just created:

```env
DATABASE_URL="mysql://USERNAME:PASSWORD@localhost:3306/perfume_store"
```

For example, if your MySQL user is `root` and password is `root123`:

```env
DATABASE_URL="mysql://root:root123@localhost:3306/perfume_store"
```

Generate a NextAuth secret and paste it into `NEXTAUTH_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Leave the `JAZZCASH_*`, `EASYPAISA_*`, and `SAFEPAY_*` variables blank for
now — they're only required once you connect real merchant accounts in a
later stage. `SEED_ADMIN_PASSWORD` / `SEED_CUSTOMER_PASSWORD` can be left as
the defaults for local testing, or changed before you run the seed.

## 3. Install dependencies

```bash
cd perfume-store
npm install
```

## 4. Generate the Prisma client and run the migration

```bash
npx prisma generate
npx prisma migrate dev --name init
```

This creates every table (`users`, `products`, `categories`, `orders`,
`payments`, etc.) in your `perfume_store` MySQL database.

## 5. Seed the database

```bash
npm run seed
```

You should see output ending with the demo admin and customer emails
(passwords come from your `.env`).

## 6. Verify (optional)

Open Prisma Studio to browse the seeded data in a UI:

```bash
npx prisma studio
```

---

**Next stage:** authentication (NextAuth + bcrypt), `lib/auth.ts`, and the
customer-facing pages (home, products, product detail, cart, wishlist,
checkout).
