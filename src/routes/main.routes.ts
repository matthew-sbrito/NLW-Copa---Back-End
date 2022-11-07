import { FastifyInstance } from "fastify";

import { guessesRouter } from "./guess.routes";
import { gameRouter } from './game.routes';
import { authRouter } from './auth.routes';
import { poolsRouter } from "./pool.routes";
import { usersRouter } from "./user.routes";

export type RouterFunction = (fastify: FastifyInstance) => Promise<void>

const applicationRouters = [
   poolsRouter,
   usersRouter,
   guessesRouter,
   authRouter,
   gameRouter
]

export async function router(fastify: FastifyInstance): Promise<void> {
   for (const currentRouter of applicationRouters) {
      await fastify.register(currentRouter)
   }
}