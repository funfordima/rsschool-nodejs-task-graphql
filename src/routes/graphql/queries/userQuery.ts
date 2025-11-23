import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';

import { UserType } from '../types/userType.js';

export const userQueries = (prisma) => ({

  users: {
    type: new GraphQLList(UserType),
    resolve: () => prisma.user.findMany(),
  },

  user: {
    type: UserType,
    args: {
      id: { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve: (_, { id }, { prisma }) =>
      prisma.user.findUnique({ where: { id } }),
  },

});
