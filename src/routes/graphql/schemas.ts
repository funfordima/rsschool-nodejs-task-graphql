import { Type } from '@fastify/type-provider-typebox';

import { GraphQLSchema, GraphQLObjectType } from 'graphql';

import { postQueries } from './queries/postQuery.js';
import { userQueries } from './queries/userQuery.js';

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
        ...postQueries(prisma),
        ...userQueries(prisma),
      },
    }),
  });

