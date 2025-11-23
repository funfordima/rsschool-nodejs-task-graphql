import { Type } from '@fastify/type-provider-typebox';

import { GraphQLSchema, GraphQLObjectType } from 'graphql';

import { postQueries } from './queries/postQuery.js';
import { userQueries } from './queries/userQuery.js';
import { memberTypeQueries } from './queries/memberTypeQuery.js';
import { profileQueries } from './queries/profileQuery.js';
import { prismaStatsQueries } from './queries/prismaStatsQuery.js';
import { profileMutation } from './mutations/profileMutation.js';
import { userMutations } from './mutations/userMutations.js';
import { postMutations } from './mutations/postMutations.js';

export const gqlResponseSchema = Type.Partial(
  Type.Object({
    data: Type.Any(),
    errors: Type.Any(),
  }),
);

export const createGqlResponseSchema = {
  body: Type.Object(
    {
      query: Type.String(),
      variables: Type.Optional(Type.Record(Type.String(), Type.Any())),
    },
    {
      additionalProperties: false,
    },
  ),
};

export const makeSchema = (prisma) =>
  new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'Query',
      fields: {
        ...memberTypeQueries(prisma),
        ...profileQueries(prisma),
        ...postQueries(prisma),
        ...userQueries(prisma),
        ...prismaStatsQueries(prisma),
      },
    }),

    mutation: new GraphQLObjectType({
      name: 'Mutation',
      fields: {
        ...userMutations(prisma),
        ...profileMutation(prisma),
        ...postMutations(prisma),
      },
    }),
  });
