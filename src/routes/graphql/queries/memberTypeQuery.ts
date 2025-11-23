import { GraphQLList, GraphQLNonNull } from 'graphql';

import { MemberType, MemberTypeIdEnum } from '../types/memberType.js';

export const memberTypeQueries = (prisma) => ({

  memberTypes: {
    type: new GraphQLList(MemberType),
    resolve: async () => {
      const types = await prisma.memberType.findMany();
      return types || [];
    },
  },

  memberType: {
    type: MemberType,
    args: {
      id: { type: new GraphQLNonNull(MemberTypeIdEnum) },
    },
    resolve: async (_parent, { id }) => {
      const type = await prisma.memberType.findUnique({ where: { id } });
      
      if (!type) throw new Error(`MemberType ${id} not found`);

      return type;
    }
  },

});