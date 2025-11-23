import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';
import { MemberType } from '../types/memberType.js';

export const memberTypeQueries = (prisma) => ({

  memberTypes: {
    type: new GraphQLList(MemberType),
    resolve: () => prisma.memberType.findMany(),
  },

  memberType: {
    type: MemberType,
    args: {
      id: { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve: (_, { id }, { prisma }) =>
      prisma.memberType.findUnique({
        where: { id },
      }),
  },

});