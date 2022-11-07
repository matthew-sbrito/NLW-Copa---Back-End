import { FastifyInstance } from "fastify";
import { prisma } from "../lib/database";
import { authenticate } from "../plugins/authenticate";
import { createPool } from "../services/pool/createPool";
import { findPoolById } from "../services/pool/findPoolById";
import { findPoolByLoggedUser } from "../services/pool/findPoolByLoggedUser";
import { joinParticipantInPool } from "../services/pool/joinParticipantInPool";
import { RouterFunction } from "./main.routes";

const PREFIX = '/pools'

function poolsRoutePrefix(route: string) {
   return `${PREFIX}/${route}`;
}

export const poolsRouter: RouterFunction = async (fastify: FastifyInstance) => {

   fastify.get(PREFIX, { onRequest: [authenticate] },
      async (request) => {
         const pools = await findPoolByLoggedUser(request.loggedUser)

         return { pools };
      }
   )

   fastify.get(poolsRoutePrefix(":id"), { onRequest: [authenticate] },
      async (request) => {
         const pool = await findPoolById(request)

         return { pool };
      }
   )

   fastify.get(poolsRoutePrefix("count"),
      async () => {
         const resultCount = await prisma.pool.count()

         return { count: resultCount }
      }
   )

   fastify.post(PREFIX,
      async (request, reply) => {
         const { code } = await createPool(request)

         return reply.status(201).send({ code })
      }
   )

   fastify.post(poolsRoutePrefix("join"), { onRequest: [authenticate] },
      async (request, reply) => {
         await joinParticipantInPool(request)

         reply.status(201).send()
      }
   )

}