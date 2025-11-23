import { GraphQLNonNull, GraphQLString } from 'graphql';

import { PostType } from '../types/postType.js';
import { logOperation } from '../metrics/metrics.js';
import { UUIDType } from '../types/uuid.js';
import { ChangePostInputType, CreatePostInputType } from '../types/inputTypes.js';

export const postMutations = (prisma) => ({
  createPost: {
    type: PostType,
    args: {
      dto: { type: new GraphQLNonNull(CreatePostInputType) }
    },
    resolve: (_, { dto }, { prisma }) => {
      logOperation('Post', 'create', dto);
      
      return prisma.post.create({ data: dto });
    },
  },

  changePost: {
    type: PostType,
    args: {
      id: {
        type: new GraphQLNonNull(UUIDType),
      },
      dto: { type: new GraphQLNonNull(ChangePostInputType) }
    },
    resolve: (_, { id, dto }, { prisma }) => {
      logOperation('Post', 'update', { id, dto });
      
      return prisma.post.update({ where: { id }, data: dto });
    },
  },

  deletePost: {
    type: GraphQLString,
    args: {
      id: {
        type: new GraphQLNonNull(UUIDType),
      },
    },
    resolve: async (_, { id }, { prisma }) => {
      logOperation('Post', 'delete', { id });

      try {
        await prisma.post.delete({ where: { id } });

        return id;
      } catch (error) {
        return null;
      }
    },
  },
});
