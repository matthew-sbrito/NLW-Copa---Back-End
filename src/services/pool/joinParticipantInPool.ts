import { ResponseErrorException } from './../../lib/ResponseErrorException';
import { prisma } from './../../lib/database';
import { FastifyRequest } from 'fastify';
import { z } from 'zod';
import { Participant, Pool, User } from '@prisma/client';
import { handleError } from '../../lib/handleError';

export async function joinParticipantInPool(request: FastifyRequest): Promise<[Pool, Participant]> {
   try {
      const joinPoolBody = z.object({
         code: z.string()
      })
   
      const { code } = joinPoolBody.parse(request.body)
   
      const pool = await findPoolByCode(code, request.loggedUser)

      verifyPoolOwnerExists(pool, request.loggedUser)

      return verifyAndCreateParticipantIfNotExists(pool, request.loggedUser)
   } catch (error) {
      throw handleError(error)
   }
}

async function findPoolByCode(code: string, user: User) {
   const pool = await prisma.pool.findUnique({
      where: {
         code
      },
      include: {
         participants: {
            where: {
               userId: user.id,
            }
         }
      }
   })

   if(!pool) {
      throw new ResponseErrorException(404, 'Pool not found!')
   }

   return pool;
}

async function verifyPoolOwnerExists(pool: Pool, user: User): Promise<void> {
   if(pool.ownerId) return;

   await prisma.pool.update({
      where: {
         id: pool.id,
      },
      data: {
         ownerId: user.id
      }
   })
}

async function verifyAndCreateParticipantIfNotExists(pool: Pool & { participants: Participant[] }, user: User): Promise<[Pool, Participant]> {
   if(pool.participants.length > 0) {
      throw new ResponseErrorException(400, 'You already joined this pool!')
   }

   const participant = await prisma.participant.create({
      data: {
         poolId: pool.id,
         userId: user.id
      }
   })

   return [pool, participant]
}