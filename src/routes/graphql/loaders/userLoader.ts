import { PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';

export const userLoader = (prisma: PrismaClient) => {
  return new DataLoader(async (ids: readonly string[]) => {
    const users = await prisma.user.findMany({
      where: {
        id: {
          in: ids as string[],
        },
      },
      include: {
        userSubscribedTo: true,
        subscribedToUser: true,
      },
    });

    return ids.map((id) => users.find((user) => user.id === id));
  });
};
