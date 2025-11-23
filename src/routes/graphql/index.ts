import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { graphql, parse, validate } from 'graphql';
import depthLimit from 'graphql-depth-limit';

import { createGqlResponseSchema, gqlResponseSchema, makeSchema } from './schemas.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const { query, variables } = req.body;
      const schema = makeSchema(prisma);

      const errors = validate(schema, parse(query), [depthLimit(5)]);

      console.log(errors);

      if (errors && errors.length > 0) {
        return {
          data: null,
          errors,
        };
      }

      const result = await graphql({
        schema,
        source: query,
        variableValues: variables,
        contextValue: { prisma: fastify.prisma },
      });

      console.log("GQL ERRORS:", result.errors);
      return result;
    },
  });
};

export default plugin;
