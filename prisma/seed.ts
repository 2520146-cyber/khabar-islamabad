import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Categories
  const categoryData = [
    { name: 'Pakistan', nameUr: 'پاکستان', slug: 'pakistan', color: '#C0161D', sortOrder: 1 },
    { name: 'Politics', nameUr: 'سیاست', slug: 'politics', color: '#1E40AF', sortOrder: 2 },
    { name: 'Business', nameUr: 'کاروبار', slug: 'business', color: '#047857', sortOrder: 3 },
    { name: 'World', nameUr: 'دنیا', slug: 'world', color: '#7C3AED', sortOrder: 4 },
    { name: 'Technology', nameUr: 'ٹیکنالوجی', slug: 'technology', color: '#2563EB', sortOrder: 5 },
    { name: 'Sports', nameUr: 'کھیل', slug: 'sports', color: '#DC2626', sortOrder: 6 },
    { name: 'Opinion', nameUr: 'رائے', slug: 'opinion', color: '#B8860B', sortOrder: 7 },
  ];

  const categories: Record<string, string> = {};

  for (const cat of categoryData) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    categories[cat.slug] = created.id;
    console.log(`  ✅ Category: ${cat.name}`);
  }

  // Super Admin
  const hashedPassword = await bcrypt.hash('admin123', 12);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@khabar.pk' },
    update: {},
    create: {
      name: 'Abdullah Ashfaq Raja',
      email: 'admin@khabar.pk',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
      isActive: true,
    },
  });
  console.log(`  ✅ Admin: ${adminUser.email}`);

  // Reporter
  const reporterPassword = await bcrypt.hash('reporter123', 12);

  const reporter = await prisma.user.upsert({
    where: { email: 'reporter@khabar.pk' },
    update: {},
    create: {
      name: 'Fatima Khan',
      email: 'reporter@khabar.pk',
      password: reporterPassword,
      role: 'REPORTER',
      isActive: true,
    },
  });
  console.log(`  ✅ Reporter: ${reporter.email}`);

  // Articles
  const articlesData = [
    {
      title: 'Islamabad Metro Bus Expansion Approved for 2026',
      subtitle: 'New routes will connect Rawalpindi to the airport, serving over 200,000 daily commuters',
      slug: 'islamabad-metro-bus-expansion-2026',
      contentHtml: '<p>The federal government has approved a major expansion of the Islamabad Metro Bus service, with three new routes set to be operational by December 2026.</p><p>The new routes will connect Rawalpindi\'s Saddar area to Islamabad International Airport. Officials estimate the expanded network will serve over 200,000 daily commuters.</p><p>"This is a landmark decision for the residents of Islamabad and Rawalpindi," said Federal Minister for Communications.</p>',
      categorySlug: 'pakistan',
      isBreaking: true,
      isFeatured: true,
    },
    {
      title: 'Pakistan Stock Exchange Crosses 80,000 Mark',
      subtitle: 'Investor confidence surges as economic reforms take effect',
      slug: 'pakistan-stock-exchange-80000',
      contentHtml: '<p>The Pakistan Stock Exchange crossed the historic 80,000 mark on Tuesday, marking a significant milestone in the country\'s economic recovery.</p><p>Analysts attribute the surge to improved macroeconomic indicators, including declining inflation and stable exchange rates.</p>',
      categorySlug: 'business',
      isBreaking: false,
      isFeatured: false,
    },
    {
      title: 'Cricket World Cup 2026: Pakistan Squad Announced',
      subtitle: 'Babar Azam to lead the 15-member squad',
      slug: 'cricket-world-cup-2026-pakistan-squad',
      contentHtml: '<p>The PCB has announced the 15-member squad for the ICC Cricket World Cup 2026. Babar Azam will continue as captain.</p><p>The squad includes several exciting young talents alongside experienced campaigners.</p>',
      categorySlug: 'sports',
      isBreaking: false,
      isFeatured: false,
    },
  ];

  for (const articleData of articlesData) {
    const { categorySlug, ...rest } = articleData;
    await prisma.article.upsert({
      where: { slug: rest.slug },
      update: {},
      create: {
        ...rest,
        status: 'PUBLISHED',
        publishedAt: new Date(),
        contentJson: '{}',
        keywords: '',
        readingTimeMinutes: Math.max(1, Math.ceil(rest.contentHtml.split(/\s+/).length / 200)),
        authorId: reporter.id,
        categoryId: categories[categorySlug],
      },
    });
    console.log(`  ✅ Article: ${rest.title}`);
  }

  console.log('\n🌱 Seeding complete!');
}

main()
  .then(async () => { await prisma.$disconnect(); })
  .catch(async (e) => { console.error('❌ Seed error:', e); await prisma.$disconnect(); process.exit(1); });
