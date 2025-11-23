import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLFloat,
  GraphQLList,
} from 'graphql';
import { PostType } from './postType.js';
import { UUIDType } from './uuid.js';
import { ProfileType } from './profileType.js';

export const UserType = new GraphQLObjectType({
  name: 'User',
  description: 'System user',

  fields: () => ({
    id: {
      type: new GraphQLNonNull(UUIDType),
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    balance: {
      type: new GraphQLNonNull(GraphQLFloat),
    },

    posts: {
      type: new GraphQLList(PostType),
      resolve: (user, args, { prisma }) =>
        prisma.post.findMany({
          where: { authorId: user.id },
        }),
    },

    profile: {
      type: ProfileType,
      resolve: ({ id }, _, { prisma }) =>
        prisma.profile.findFirst({ where: { userId: id } }),
    },

    subscribedToUser: {
      type: new GraphQLList(UserType),
      description: 'Users for whom this user subscribed to',
      resolve: async (source, _args: unknown, context) =>
        source.subscribedToUser
          ? context.loaders.userLoader.loadMany(
              source.subscribedToUser.map((user) => user.subscriberId),
            )
          : null,
    },

    userSubscribedTo: {
      type: new GraphQLList(UserType),
      description: 'Users subscribed to this user',
      resolve: async (source, _args: unknown, context) =>
        source.userSubscribedTo
          ? context.loaders.userLoader.loadMany(
              source.userSubscribedTo.map((user) => user.authorId),
            )
          : null,
    },
  }),
});
