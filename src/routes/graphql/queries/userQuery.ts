import { GraphQLList, GraphQLNonNull } from 'graphql';

import { UserType } from '../types/userType.js';
import { UUIDType } from '../types/uuid.js';

export const userQueries = (prisma) => ({

  users: {
    type: new GraphQLList(UserType),
    resolve: () => prisma.user.findMany(),
  },

  user: {
    type: UserType,
    args: {
      id: { type: new GraphQLNonNull(UUIDType) },
    },
    resolve: (_, { id }) =>
      prisma.user.findUnique({ where: { id } }),
  },

});
