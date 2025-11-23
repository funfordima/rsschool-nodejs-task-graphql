import { GraphQLFloat, GraphQLNonNull, GraphQLString } from 'graphql';

import { UserType } from '../types/userType.js';
import { logOperation } from '../metrics/metrics.js';

export const userMutations = (prisma) => ({
  createUser: {
    type: UserType,
    args: {
      name: {
        type: new GraphQLNonNull(GraphQLString),
      },
      balance: {
        type: new GraphQLNonNull(GraphQLFloat),
      },
    },
    resolve: (_, args, { prisma }) => {
      logOperation('User', 'create', args);

      return prisma.user.create({ data: args });
    },
  },

  updateUser: {
    type: UserType,
    args: {
      id: {
        type: new GraphQLNonNull(GraphQLString),
      },
      name: {
        type: GraphQLString,
      },
      balance: {
        type: GraphQLFloat,
      },
    },
    resolve: (_, { id, ...rest }, { prisma }) => {
      logOperation('User', 'update', { id, ...rest });

      return prisma.user.update({ where: { id }, data: rest });
    },
  },

  deleteUser: {
    type: UserType,
    args: {
      id: {
        type: new GraphQLNonNull(GraphQLString),
      },
    },
    resolve: async (_, { id }, { prisma }) => {
      logOperation('User', 'delete', { id });

      await prisma.user.delete({ where: { id } });

      return id;
    },
  },
});
