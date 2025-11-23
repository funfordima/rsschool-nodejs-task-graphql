import { GraphQLBoolean, GraphQLInt, GraphQLNonNull, GraphQLObjectType } from 'graphql';

import { UserType } from './userType.js';
import { MemberType } from './memberType.js';
import { UUIDType } from './uuid.js';

export const ProfileType = new GraphQLObjectType({
  name: 'ProfileType',
  description: 'User profile information',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(UUIDType),
      description: 'Profile Id (UUID)'
    },

    isMale: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description: 'User gender'
    },

    yearOfBirth: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'Year of birth'
    },

    userId: {
      type: new GraphQLNonNull(UserType),
      resolve: (profile, args, { prisma }) => {
        return prisma.user.findUnique({ where: { id: profile.userId }});
      },
    },

    memberTypeId: {
      type: new GraphQLNonNull(MemberType),
      resolve: (profile, args, { prisma }) => {
        return prisma.memberType.findUnique({ where: { id: profile.memberTypeId }});
      },
    },

    user: {
      type: UserType,
      resolve: ({ userId }, _, { prisma }) => {
        return prisma.user.findUnique({ where: { id: userId } });
      },
    },

    memberType: {
      type: MemberType,
      resolve: async ({ memberTypeId }, _args: unknown, context) =>
        await context.loaders.memberTypeLoader.load(memberTypeId),
    },
  }),
});