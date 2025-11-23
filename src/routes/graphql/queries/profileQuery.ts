import { GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql';

import { ProfileType } from '../types/profileType.js';

export const profileQueries = (prisma) => ({
  profile: {
    type: ProfileType,
    args: {
      id: {
        type: new GraphQLNonNull(GraphQLString),
      }
    },
    resolve: (_, { id }, { prisma }) => prisma.profile.findUnique({ where: { id }}),
  },

  profiles: {
    type: new GraphQLList(ProfileType),
    resolve: () => prisma.profile.findMany(),
  },
});
