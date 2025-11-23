import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';
import { PostType } from '../types/postType.js';

export const postQueries = (prisma) => ({

  posts: {
    type: new GraphQLList(PostType),
    resolve: () => prisma.post.findMany(),
  },

  post: {
    type: PostType,
    args: {
      id: { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve: (_, { id }, { prisma }) =>
      prisma.post.findUnique({
        where: { id },
      }),
  },

});
