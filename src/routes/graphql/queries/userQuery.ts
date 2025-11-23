import { GraphQLList, GraphQLNonNull, GraphQLResolveInfo } from 'graphql';

import { UserType } from '../types/userType.js';
import { UUIDType } from '../types/uuid.js';
import { parseResolveInfo, ResolveTree, simplifyParsedResolveInfoFragmentWithType } from 'graphql-parse-resolve-info';

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

        return users ?? [];
    },
  },

  user: {
    type: UserType,
    args: {
      id: { type: new GraphQLNonNull(UUIDType) },
    },
    resolve: async (_, { id }, context) => await context.loaders.userLoader.load(id),
  },

});
