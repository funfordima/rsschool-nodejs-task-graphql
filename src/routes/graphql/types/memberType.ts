import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLFloat,
  GraphQLEnumType,
  GraphQLInt,
} from 'graphql';

export const MemberTypeIdEnum = new GraphQLEnumType({
  name: "MemberTypeIdEnum",
  values: {
    BASIC: { value: "BASIC" },
    BUSINESS: { value: "BUSINESS" },
  },
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
  }),
});
