import { GraphQLList, GraphQLNonNull } from 'graphql';

import { ProfileType } from '../types/profileType.js';
import { UUIDType } from '../types/uuid.js';

export const profileQueries = (prisma) => ({
  profile: {
    type: ProfileType,
    args: {
      id: {
        type: new GraphQLNonNull(UUIDType),
      }
    },
    resolve: (_, { id }) => prisma.profile.findUnique({ where: { id }}),
  },

  profiles: {
    type: new GraphQLList(ProfileType),
    resolve: () => prisma.profile.findMany(),
  },
});
