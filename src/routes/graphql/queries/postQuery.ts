import { GraphQLList, GraphQLNonNull } from 'graphql';

import { PostType } from '../types/postType.js';
import { UUIDType } from '../types/uuid.js';

export const postQueries = (prisma) => ({

  posts: {
    type: new GraphQLList(PostType),
    resolve: () => prisma.post.findMany(),
  },

  post: {
    type: PostType,
    args: {
      id: { type: new GraphQLNonNull(UUIDType) },
    },
    resolve: (_, { id }) =>
      prisma.post.findUnique({
        where: { id },
      }),
  },

});
