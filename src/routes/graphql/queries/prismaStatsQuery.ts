import { PrismaStatsType } from '../types/prismaStatsType.js';

export const prismaStatsQueries = (prisma) => ({
  stats: {
    type: PrismaStatsType,
    resolve: (prisma) => {
      const operationHistory = prisma.$metrics?.getOperations?.() || [];
      
      return { operationHistory };
    },
  },
});
