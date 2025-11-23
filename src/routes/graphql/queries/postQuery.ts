import { GraphQLList, GraphQLNonNull } from 'graphql';

import { PostType } from '../types/postType.js';
import { UUIDType } from '../types/uuid.js';
import { logOperation } from '../metrics/metrics.js';

export const postQueries = (prisma) => ({

  posts: {
    type: new GraphQLList(PostType),
    resolve: () => {
      const posts = prisma.post.findMany();

      logOperation('Posts', 'load', posts);

      return posts;
    },
  },

  post: {
    type: PostType,
    args: {
      id: { type: new GraphQLNonNull(UUIDType) },
    },
    resolve: (_, { id }) => {
      const post = prisma.post.findUnique({
        where: { id },
      });

      logOperation('Post', 'load', post);

      return post;
    }
  },

});
