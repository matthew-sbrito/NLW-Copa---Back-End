import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/database";
import { authenticate } from "../plugins/authenticate";
import { findGamesByPoolId } from "../services/game/findGamesByPoolId";
import { RouterFunction } from "./main.routes";

const PREFIX = '/games'

function gameRoutePrefix(route: string) {
   return `${PREFIX}/${route}`;
}

export const gameRouter: RouterFunction = async (fastify: FastifyInstance) => {

   fastify.get(gameRoutePrefix("count"),
      async () => {
         const resultCount = await prisma.game.count()

         return { count: resultCount }
      }
   )

   fastify.get(gameRoutePrefix("pool/:poolId"), { onRequest: [authenticate] },
      async (request) => {
         const getPoolsParams = z.object({
            poolId: z.string()
         })            

         const { poolId } = getPoolsParams.parse(request.params)

         console.log(poolId);

         return await findGamesByPoolId(poolId, request.loggedUser.id)
      }
   )

}