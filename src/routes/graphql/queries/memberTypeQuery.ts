import { GraphQLList, GraphQLNonNull } from 'graphql';

import { MemberType, MemberTypeIdEnum } from '../types/memberType.js';
import { logOperation } from '../metrics/metrics.js';

export const memberTypeQueries = (prisma) => ({

  memberTypes: {
    type: new GraphQLList(MemberType),
    resolve: async () => {
      const types = await prisma.memberType.findMany();

      logOperation('MemberTypes', 'load', types);

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

      logOperation('MemberType', 'load', type);

      return type;
    }
  },

});