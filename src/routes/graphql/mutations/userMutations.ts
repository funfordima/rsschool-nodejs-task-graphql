import { GraphQLNonNull, GraphQLString } from 'graphql';

import { UserType } from '../types/userType.js';
import { logOperation } from '../metrics/metrics.js';
import { UUIDType } from '../types/uuid.js';
import { ChangeUserInput, CreateUserInput } from '../types/inputTypes.js';

export const userMutations = (prisma) => ({
  createUser: {
    type: UserType,
    args: {
      dto: { type: new GraphQLNonNull(CreateUserInput) }
    },
    resolve: (_, { dto }, { prisma }) => {
      logOperation('User', 'create', dto);

      return prisma.user.create({ data: dto });
    },
  },

  changeUser: {
    type: UserType,
    args: {
      id: {
        type: new GraphQLNonNull(UUIDType),
      },
      dto: { type: new GraphQLNonNull(ChangeUserInput) }
    },
    resolve: (_, { id, dto }, { prisma }) => {
      logOperation('User', 'update', { id, dto });

      return prisma.user.update({ where: { id }, data: dto });
    },
  },

  deleteUser: {
    type: GraphQLString,
    args: {
      id: {
        type: new GraphQLNonNull(UUIDType),
      },
    },
    resolve: async (_, { id }, { prisma }) => {
      logOperation('User', 'delete', { id });
      
      try {
        await prisma.user.delete({ where: { id } });

        return id;
      } catch (error) {
        return null;
      }
    },
  },
});
