import { GraphQLNonNull, GraphQLString } from 'graphql';

import { PostType } from '../types/postType.js';
import { logOperation } from '../metrics/metrics.js';

export const postMutations = (prisma) => ({
  createPost: {
    type: PostType,
    args: {
      title: {
        type: new GraphQLNonNull(GraphQLString),
      },
      content: {
        type: new GraphQLNonNull(GraphQLString),
      },
      authorId: {
        type: new GraphQLNonNull(GraphQLString),
      }
    },
    resolve: (_, args, { prisma }) => {
      logOperation('Post', 'create', args);
      
      return prisma.post.create({ data: args });
    },
  },

  updatePost: {
    type: PostType,
    args: {
      id: {
        type: new GraphQLNonNull(GraphQLString),
      },
      title: {
        type: GraphQLString,
      },
      content: {
        type: GraphQLString,
      },
    },
    resolve: (_, { id, ...rest }, { prisma }) => {
      logOperation('Post', 'update', { id, ...rest });
      
      return prisma.post.update({ where: { id }, data: rest });
    },
  },

  deletePost: {
    type: PostType,
    args: {
      id: {
        type: new GraphQLNonNull(GraphQLString),
      },
    },
    resolve: async (_, { id }, { prisma }) => {
      logOperation('Post', 'delete', { id });
      
      await  prisma.post.delete({ where: { id } });

      return id;
    },
  },
});
