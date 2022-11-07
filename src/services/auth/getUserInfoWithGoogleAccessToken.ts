import { ResponseErrorException } from './../../lib/ResponseErrorException';
import fetch from "node-fetch";

import { FastifyRequest } from "fastify";
import { z } from "zod";

const GOOGLE_OAUTH_API_BASE = 'https://www.googleapis.com/oauth2'

export interface UserGoogleInfo {
   id: string;
   email: string;
   name: string;
   picture: string;
}

export async function getUserInfoWithGoogleAccessToken(request: FastifyRequest): Promise<UserGoogleInfo> {
   const authenticateUserBody = z.object({
      access_token: z.string(),
   });

   const { access_token } = authenticateUserBody.parse(request.body);

   const userResponse = await fetch(`${GOOGLE_OAUTH_API_BASE}/v2/userinfo`, {
      method: 'GET',
      headers: {
         Authorization: `Bearer ${access_token}`
      }
   });

   if(userResponse.status != 200) {
      throw new ResponseErrorException(401, 'Token is missing!')
   }

   const userData = await userResponse.json();

   const userInfoSchema = z.object({
      id: z.string(),
      email: z.string().email(),
      name: z.string(),
      picture: z.string().url(),
   })

   return userInfoSchema.parse(userData);
}