import { GraphQLBoolean, GraphQLInt, GraphQLNonNull, GraphQLString } from 'graphql';

import { ProfileType } from '../types/profileType.js';
import { MemberTypeIdEnum } from '../types/memberType.js';
import { logOperation } from '../metrics/metrics.js';

export const profileMutation = (prisma) => ({
  createProfile: {
    type: ProfileType,
    args: {
      userId: {
        type: new GraphQLNonNull(GraphQLString),
      },
      isMale: {
        type: new GraphQLNonNull(GraphQLBoolean),
      },
      memberTypeId: {
        type: new GraphQLNonNull(MemberTypeIdEnum),
      },
      yearOfBirth: {
        type: new GraphQLNonNull(GraphQLInt),
      },
    },
    resolve: (_, args, { prisma }) => {
      logOperation('Profile', 'create', args);

      return prisma.profile.create({ data: args });
    },
  },

  updateProfile: {
    type: ProfileType,
    args: {
      id: {
        type: new GraphQLNonNull(GraphQLString),
      },
      isMale: {
        type: GraphQLBoolean,
      },
      memberTypeId: {
        type: MemberTypeIdEnum,
      },
      yearOfBirth: {
        type: GraphQLInt,
      },
    },
    resolve: (_, { id, ...rest }, { prisma }) => {
      logOperation('Profile', 'update', { id, ...rest });

      return prisma.profile.update({ where: { id }, data: rest });
    },
  },

  deleteProfile: {
    type: ProfileType,
    args: {
      id: {
        type: new GraphQLNonNull(GraphQLString),
      },
    },
    resolve: async (_, { id }, { prisma }) => {
      logOperation('Profile', 'delete', { id });

      await prisma.profile.delete({ where: { id }});

      return id;
    },
  },
});
