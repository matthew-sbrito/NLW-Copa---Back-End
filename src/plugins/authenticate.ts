import { prisma } from './../lib/database';
import { FastifyRequest } from 'fastify';

export async function authenticate(request: FastifyRequest) {
   
   await request.jwtVerify() 

   const { sub } = request.user

   const user = await prisma.user.findUnique({
      where: {
         id: sub
      }
   })

   request.loggedUser = user!!
}