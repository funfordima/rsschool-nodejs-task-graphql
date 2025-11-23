import { getOperations } from '../metrics/metrics.js';
import { PrismaStatsType } from '../types/prismaStatsType.js';

export const prismaStatsQueries = (prisma) => ({
  stats: {
    type: PrismaStatsType,
    resolve: (prisma) => ({
      operationHistory: getOperations(),
    }),
  },
});
