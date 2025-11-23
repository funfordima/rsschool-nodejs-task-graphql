import { GraphQLString, GraphQLNonNull } from 'graphql';

import { UUIDType } from '../types/uuid.js';

export const subscribeMutation = (prisma) => ({
  subscribeTo: {
    type: GraphQLString,
    args: {
      userId: { type: new GraphQLNonNull(UUIDType) },
      authorId: { type: new GraphQLNonNull(UUIDType) },
    },
    resolve: async (
      _source: unknown,
      args: { userId: string; authorId: string },
      { prisma },
    ) => {
      await prisma.user.update({
        where: { id: args.userId },
        data: { userSubscribedTo: { create: { authorId: args.authorId } } },
      });

      return 'Subscribed successfully';
    },
  },

  unsubscribeFrom: {
    type: GraphQLString,
    args: {
      userId: { type: new GraphQLNonNull(UUIDType) },
      authorId: { type: new GraphQLNonNull(UUIDType) },
    },
    resolve: async (
      _source: unknown,
      args: { userId: string; authorId: string },
      { prisma },
    ) => {
      await prisma.subscribersOnAuthors.delete({
        where: {
          subscriberId_authorId: { subscriberId: args.userId, authorId: args.authorId },
        },
      });

      return 'Unsubscribed successfully';
    },
  },
});
