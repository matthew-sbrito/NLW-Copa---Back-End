import { FastifyInstance } from "fastify";
import { prisma } from "../lib/database";
import { authenticate } from "../plugins/authenticate";
import { createGuessByPoolAndGame } from "../services/guess/createGuessByPoolAndGame";
import { RouterFunction } from "./main.routes";

const PREFIX = '/guesses'

function guessesRoutePrefix(route: string) {
   return `${PREFIX}/${route}`;
}

export const guessesRouter: RouterFunction = async (fastify: FastifyInstance) => {

   fastify.get(guessesRoutePrefix("count"),
      async () => {
         const resultCount = await prisma.guess.count()

         return { count: resultCount }
      }
   )

   fastify.post(guessesRoutePrefix('pools/:poolId/games/:gameId'), { onRequest: [authenticate] },
      async (request, reply) => {
         await createGuessByPoolAndGame(request)

         reply.status(201).send();
      }
   )
}