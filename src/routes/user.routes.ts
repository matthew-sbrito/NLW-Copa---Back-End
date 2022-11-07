import { FastifyInstance } from "fastify";
import { RouterFunction } from "./main.routes";
import { prisma } from "../lib/database";

const PREFIX = '/users'

function usersRoutePrefix(route: string) {
   return `${PREFIX}/${route}`;
}

export const usersRouter: RouterFunction = async (fastify: FastifyInstance) => {

   fastify.get(usersRoutePrefix("count"),
      async () => {
         const resultCount = await prisma.user.count()

         return {
            count: resultCount
         }
      }
   )

}