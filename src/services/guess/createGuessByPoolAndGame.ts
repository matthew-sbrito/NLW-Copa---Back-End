import { ResponseErrorException } from '../../lib/ResponseErrorException';
import { prisma } from '../../lib/database';
import { FastifyRequest } from 'fastify';
import { z, ZodError } from 'zod';
import { handleError } from '../../lib/handleError';


export async function createGuessByPoolAndGame(request: FastifyRequest) {
   try {
      const createGuessParams = z.object({
         poolId: z.string(),
         gameId: z.string()
      })
   
      const createGuessBody = z.object({
         firstTeamPoints: z.number(),
         secondTeamPoints: z.number(),
      })
   
      const { poolId, gameId } = createGuessParams.parse(request.params)
      const { firstTeamPoints, secondTeamPoints } = createGuessBody.parse(request.body)
   
      const partincipant = await getParticipant(poolId, request.loggedUser.id)
   
      const game = await findGameAndValidateRules(gameId)
   
      await findGuessThrowIfExists(partincipant.id, game.id)
   
      return await prisma.guess.create({
         data: {
            gameId: game.id,
            participantId: partincipant.id,
            firstTeamPoints,
            secondTeamPoints
         }
      })
   } catch (error) {
      throw handleError(error)
   }
}

async function getParticipant(poolId: string, userId: string) {
   const partincipant = await prisma.participant.findUnique({
      where: {
         userId_poolId: {
            poolId,
            userId
         }
      }
   })

   if(!partincipant) {
      throw new ResponseErrorException(404, "You're not allowed to create guess inside this pool.")
   }

   return partincipant;
}

async function findGuessThrowIfExists(participantId: string, gameId: string) {
   const guess = await prisma.guess.findUnique({
      where: {
         participantId_gameId: {
            participantId,
            gameId
         }
      }
   })

   if(guess) {
      throw new ResponseErrorException(400, "You already sent a guess to this game on this pool.");
   }
}

async function findGameAndValidateRules(gameId: string) {
   const game = await prisma.game.findUnique({
      where: {
         id: gameId
      }
   })

   if(!game) {
      throw new ResponseErrorException(404, "Game not found!")
   }

   if(game.date < new Date()) {
      throw new ResponseErrorException(400, "You cannot send guesses after the game date.")
   }

   return game
}