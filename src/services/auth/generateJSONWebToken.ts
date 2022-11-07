import { User } from '@prisma/client';
import { FastifyInstance } from 'fastify';


export async function generateJSONWebToken(fastify: FastifyInstance, user: User): Promise<string> {
   const payload = { 
      name: user.name,
      avatarUl: user.avatarUrl,
   };

   return fastify.jwt.sign(payload, {
      sub: user.id,
      expiresIn: '7 days',
   })
}