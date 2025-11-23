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
  }),
});
