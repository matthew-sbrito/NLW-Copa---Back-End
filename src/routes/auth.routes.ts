import { FastifyInstance } from "fastify";
import { RouterFunction } from "./main.routes";

import { getUserInfoWithGoogleAccessToken } from '../services/auth/getUserInfoWithGoogleAccessToken';
import { findOrCreateUserWithGoogleInfo } from '../services/auth/findOrCreateUserWithGoogleInfo';
import { generateJSONWebToken } from '../services/auth/generateJSONWebToken';
import { authenticate } from '../plugins/authenticate';

const PREFIX = '/auth'

function authRoutePrefix(route: string) {
   return `${PREFIX}/${route}`;
}

export const authRouter: RouterFunction = async (fastify: FastifyInstance) => {
   fastify.post(authRoutePrefix('authenticate'),
      async (request) => {

         const userInfo = await getUserInfoWithGoogleAccessToken(request);

         const user = await findOrCreateUserWithGoogleInfo(userInfo);

         const token = await generateJSONWebToken(fastify, user)

         return { token };
      }
   )

   fastify.get(authRoutePrefix('me'), { onRequest: [authenticate] },
      async (request) => {
         return { user: request.loggedUser }
      }
   )
}