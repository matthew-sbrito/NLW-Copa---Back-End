import { User } from '@prisma/client';
import { prisma } from './../../lib/database';

export async function findPoolByLoggedUser(user: User) {

   return await prisma.pool.findMany({
      where: {
        participants: {
         some: {
            userId: user.id
         }
        } 
      },
      include: {
         _count: {
            select: {
               participants: true,
            },
         },
         owner: {
            select: {
               id: true,
               name: true,
            }
         },
         participants: {
            select: {
               id: true,
               user: {
                  select: {
                     name: true,
                     avatarUrl: true
                  }
               }
            },
            take: 4
         }
      }
     }) 
}