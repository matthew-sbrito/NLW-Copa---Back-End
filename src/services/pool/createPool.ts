import ShortUniqueId from 'short-unique-id';
import { prisma } from './../../lib/database';
import { FastifyRequest } from 'fastify';
import { z } from 'zod';
import { Pool } from '@prisma/client';

const generate = new ShortUniqueId({ length: 6 })

export async function createPool(request: FastifyRequest): Promise<Pool> {
   const createPoolBody = z.object({ 
      title: z.string(),
   })

   const { title } = createPoolBody.parse(request.body)

   const code = String(generate()).toUpperCase()

   let ownerId: string | undefined;

   try {
      await request.jwtVerify()

      ownerId = request.user.sub
   } catch (error) {
      ownerId = undefined
   }

  return await prisma.pool.create({
      data: {
         title,
         code,
         ownerId,
         participants: ownerId
            ? {
               create: {
                  userId: ownerId
               }
            }
            : undefined
      }
   })
}