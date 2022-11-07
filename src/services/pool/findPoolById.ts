import { FastifyRequest } from 'fastify';
import { ResponseErrorException } from './../../lib/ResponseErrorException';
import { prisma } from './../../lib/database';
import { z } from 'zod';

export async function findPoolById(request: FastifyRequest) {

   const getPoolParams = z.object({
      id: z.string()
   })

   const { id } = getPoolParams.parse(request.params)

   const pool = await prisma.pool.findUnique({
      where: {
         id
      },
      include: {
         _count: {
            select: {
               participants: true,
            },
         },
         owner: {
            select: {
               id: true,
               name: true,
            }
         },
         participants: {
            select: {
               id: true,
               user: {
                  select: {
                     avatarUrl: true
                  }
               }
            },
            take: 4
         }
      }
   })

   if (!pool) {
      throw new ResponseErrorException(404, 'Pool not found!')
   }

   return pool;
}