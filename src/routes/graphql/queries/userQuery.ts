import { GraphQLList, GraphQLNonNull, GraphQLResolveInfo } from 'graphql';

import { UserType } from '../types/userType.js';
import { UUIDType } from '../types/uuid.js';
import { parseResolveInfo, ResolveTree, simplifyParsedResolveInfoFragmentWithType } from 'graphql-parse-resolve-info';
import { logOperation } from '../metrics/metrics.js';

export const userQueries = (prisma) => ({
  users: {
    type: new GraphQLList(UserType),
    resolve: async (_, _args, context, info: GraphQLResolveInfo,) => {
      const parsedInfo = parseResolveInfo(info);
      
      const {
          fields,
        }: {
          fields: { userSubscribedTo?: ResolveTree; subscribedToUser?: ResolveTree };
        } = simplifyParsedResolveInfoFragmentWithType(
          parsedInfo as ResolveTree,
          new GraphQLList(UserType),
        );

        const users = await context.prisma.user.findMany({
          include: {
            userSubscribedTo: !!fields.userSubscribedTo,
            subscribedToUser: !!fields.subscribedToUser,
          },
        });

        for (const user of users) {
          context.loaders.userLoader.prime(user.id, user);
        }

        logOperation('Users', 'load', users);

        return users;
    },
  },

  user: {
    type: UserType,
    args: {
      id: { type: new GraphQLNonNull(UUIDType) },
    },
    resolve: async (_, { id }, context) => {
      const user = await context.loaders.userLoader.load(id);

      logOperation('User', 'load', user);

      return user;
    }
  },

});
