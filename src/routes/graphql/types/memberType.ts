import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLFloat,
  GraphQLEnumType,
  GraphQLInt,
  GraphQLList,
} from 'graphql';
import { MemberTypeId } from '../../member-types/schemas.js';
import { ProfileType } from './profileType.js';

export const MemberTypeIdEnum = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: Object.fromEntries(
    Object.values(MemberTypeId).map((key) => [key, { value: key }])
  ),
});

export const MemberType = new GraphQLObjectType({
  name: 'MemberType',
  description: 'Base membership',

  fields: () => ({
    id: {
      type: new GraphQLNonNull(MemberTypeIdEnum),
      description: 'Member type Id (BASIC or BUSINESS)'
    },
    discount: {
      type: new GraphQLNonNull(GraphQLFloat),
      description: 'Member type discount'
    },
    postsLimitPerMonth: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'Monthly post creation limit'
    },
    profiles: {
      type: new GraphQLList(ProfileType),
      resolve: async (source, _args: unknown, { prisma }) =>
        await prisma.profile.findMany({ where: { memberTypeId: source.id } }),
    },
  }),
});
