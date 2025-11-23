import { GraphQLList, GraphQLNonNull } from 'graphql';

import { ProfileType } from '../types/profileType.js';
import { UUIDType } from '../types/uuid.js';
import { logOperation } from '../metrics/metrics.js';

export const profileQueries = (prisma) => ({
  profile: {
    type: ProfileType,
    args: {
      id: {
        type: new GraphQLNonNull(UUIDType),
      }
    },
    resolve: (_, { id }) => {
      const profile = prisma.profile.findUnique({ where: { id }});

      logOperation('Profile', 'load', profile);
      
      return profile;
    }
  },

  profiles: {
    type: new GraphQLList(ProfileType),
    resolve: () => {
      const profiles = prisma.profile.findMany();

      logOperation('Profiles', 'load', profiles);

      return profiles;
    }
  },
});
