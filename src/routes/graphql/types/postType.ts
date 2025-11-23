import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
} from 'graphql';
import { UserType } from './userType.js';

export const PostType = new GraphQLObjectType({
  name: 'Post',
  description: 'Blog post entry',

  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString),
    },
    title: {
      type: new GraphQLNonNull(GraphQLString),
    },
    content: {
      type: new GraphQLNonNull(GraphQLString),
    },
    authorId: {
      type: new GraphQLNonNull(GraphQLString),
    },
    author: {
      type: UserType,
      resolve: (post, args, context) => {
        return context.prisma.user.findUnique({
          where: { id: post.authorId },
        });
      },
    },
  }),
});
