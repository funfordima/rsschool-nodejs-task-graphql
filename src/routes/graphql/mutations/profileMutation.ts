import { GraphQLNonNull, GraphQLString } from 'graphql';

import { ProfileType } from '../types/profileType.js';
import { logOperation } from '../metrics/metrics.js';
import { ChangeProfileInput, CreateProfileInputType } from '../types/inputTypes.js';
import { UUIDType } from '../types/uuid.js';

export const profileMutation = (prisma) => ({
  createProfile: {
    type: ProfileType,
    args: {
      dto: { type: new GraphQLNonNull(CreateProfileInputType) }
    },
    resolve: (_, { dto }, { prisma }) => {
      logOperation('Profile', 'create', dto);

      return prisma.profile.create({ data: dto });
    },
  },

  changeProfile: {
    type: ProfileType,
    args: {
      id: {
        type: new GraphQLNonNull(UUIDType),
      },
      dto: { type: new GraphQLNonNull(ChangeProfileInput) }
    },
    resolve: (_, { id, dto  }, { prisma }) => {
      logOperation('Profile', 'update', { id, dto  });

      return prisma.profile.update({ where: { id }, data: dto  });
    },
  },

  deleteProfile: {
    type: GraphQLString,
    args: {
      id: {
        type: new GraphQLNonNull(UUIDType),
      },
    },
    resolve: async (_, { id }, { prisma }) => {
      logOperation('Profile', 'delete', { id });

      try {
        await prisma.profile.delete({ where: { id }});

        return id;
      } catch (error) {
        return null;
      }
    },
  },
});
