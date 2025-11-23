import { PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';

import { userLoader } from './userLoader.js';
import { postsLoader } from './postsLoader.js';
import { memberTypeLoader } from './memberTypeLoader.js';
import { profileLoader } from './profileLoader.js';

export const getLoaders = (prisma) => ({
  userLoader: userLoader(prisma),
  postsLoader: postsLoader(prisma),
  memberTypeLoader: memberTypeLoader(prisma),
  profileLoader: profileLoader(prisma),
});













export function createUserSubscriptionLoader(prisma) {
  return new DataLoader<string, string[]>(async (authorIds) => {
    const subscriptions = await prisma.subscribersOnAuthors.findMany({
      where: { authorId: { in: [...authorIds] } },
    });

    const map: Record<string, string[]> = {};
    authorIds.forEach((id) => (map[id] = []));

    subscriptions.forEach((sub) => {
      map[sub.authorId].push(sub.subscriberId);
    });

    return authorIds.map((id) => map[id]);
  });
};

export function createSubscribedToLoader(prisma) {
  return new DataLoader<string, string[]>(async (subscriberIds) => {
    const subscriptions = await prisma.subscribersOnAuthors.findMany({
      where: { subscriberId: { in: [...subscriberIds] } },
    });

    const map: Record<string, string[]> = {};
    subscriberIds.forEach((id) => (map[id] = []));

    subscriptions.forEach((sub) => {
      map[sub.subscriberId].push(sub.authorId);
    });

    return subscriberIds.map((id) => map[id]);
  });
};

export async function preloadUsersInLoaders(
  prisma: PrismaClient,
  subscribedToLoader: ReturnType<typeof createSubscribedToLoader>,
  userSubscribersLoader: ReturnType<typeof createUserSubscriptionLoader>
) {
  const users = await prisma.user.findMany();

  for (const user of users) {
    const subscribedToIds = await prisma.subscribersOnAuthors
      .findMany({ where: { subscriberId: user.id } })
      .then((subs) => subs.map((s) => s.authorId));
      
    subscribedToLoader.prime(user.id, subscribedToIds);

    const subscriberIds = await prisma.subscribersOnAuthors
      .findMany({ where: { authorId: user.id } })
      .then((subs) => subs.map((s) => s.subscriberId));

    userSubscribersLoader.prime(user.id, subscriberIds);
  }
}
