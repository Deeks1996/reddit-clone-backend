import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Main user
  const existingUser = await prisma.user.findUnique({
    where: { email: 'shettydeeksha810@gmail.com' },
  });

  if (!existingUser) {
    console.error('User not found');
    return;
  }

  // Dummy user for public/unclaimed posts
  const anonymousUser = await prisma.user.upsert({
    where: { email: 'anonymous@guest.com' },
    update: {},
    create: {
      fullName: 'Anonymous',
      email: 'anonymous@guest.com',
    },
  });

  // Communities
  const techCommunity = await prisma.community.upsert({
    where: { name: 'Tech Enthusiasts' },
    update: {},
    create: {
      name: 'Tech Enthusiasts',
      description: 'A community for tech lovers and developers.',
    },
  });

  const foodCommunity = await prisma.community.upsert({
    where: { name: 'Food Lovers' },
    update: {},
    create: {
      name: 'Food Lovers',
      description: 'A community for sharing recipes and food tips.',
    },
  });

  const travelCommunity = await prisma.community.upsert({
    where: { name: 'Travel Diaries' },
    update: {},
    create: {
      name: 'Travel Diaries',
      description: 'Explore the world and share travel stories.',
    },
  });

  const healthCommunity = await prisma.community.upsert({
    where: { name: 'Health & Wellness' },
    update: {},
    create: {
      name: 'Health & Wellness',
      description: 'Tips for a healthy mind and body.',
    },
  });

  // Posts by main user
  await prisma.post.create({
    data: {
      title: 'How to build a full-stack app with Next.js and Prisma',
      content: 'Here is a guide on building a full-stack app using Next.js, Prisma, and more.',
      imageUrl: 'https://media2.dev.to/dynamic/image/width=1000,height=420,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fds4yi6va1jyjhyfroddl.png',
      linkUrl: 'https://www.prisma.io/docs/guides/nextjs',
      communityId: techCommunity.id,
      authorId: existingUser.id,
    },
  });

  await prisma.post.create({
    data: {
      title: 'Best JavaScript frameworks in 2025',
      content: 'Let&apos;s discuss the top JavaScript frameworks that are trending in 2025.',
      imageUrl: 'https://www.metizsoft.com/wp-content/uploads/2024/03/top-10-javascript-frameworks-1200x675.jpg',
      linkUrl: 'https://dev.to/this-is-learning/javascript-frameworks-heading-into-2025-hkb',
      communityId: techCommunity.id,
      authorId: existingUser.id,
    },
  });

  // Public posts by Anonymous user
  await prisma.post.createMany({
    data: [
      {
        title: 'Top 10 Places to Visit in Europe',
        content: 'Check out these amazing destinations for your next vacation.',
        imageUrl: 'https://static2.tripoto.com/media/filter/tst/img/170380/TripDocument/1565073615_biggest_cities_in_europe.jpg',
        linkUrl: 'https://www.timeout.com/europe/travel/most-beautiful-places-in-europe',
        communityId: travelCommunity.id,
        authorId: anonymousUser.id,
      },
      {
        title: 'Healthy Smoothie Recipes',
        content: 'These smoothie recipes will boost your energy levels.',
        imageUrl: 'https://www.evolvingtable.com/wp-content/uploads/2022/12/How-to-Make-Smoothie-2.jpg',
        linkUrl: 'https://www.loveandlemons.com/healthy-breakfast-smoothies/',
        communityId: healthCommunity.id,
        authorId: anonymousUser.id,
      },
      {
        title: '10-Minute Workouts for Busy People',
        content: 'Stay fit even with a tight schedule.',
        imageUrl: 'https://www.puregym.com/media/hywdyed5/hiit-workout.jpg?quality=80',
        linkUrl: 'https://www.heart.org/en/healthy-living/fitness/getting-active/10-minute-home-workout',
        communityId: healthCommunity.id,
        authorId: anonymousUser.id,
      },
      {
        title: 'Best Indian Street Foods to Try',
        content: 'You can&apos;t miss these delicious street foods from India.',
        imageUrl: 'https://tildaricelive.s3.eu-central-1.amazonaws.com/wp-content/uploads/2024/07/11111642/Street-food-2440x1470.jpeg',
        linkUrl: 'https://intentionaldetours.com/indian-street-food/',
        communityId: foodCommunity.id,
        authorId: anonymousUser.id,
      },
    ],
  });

  console.log('Seed data created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
