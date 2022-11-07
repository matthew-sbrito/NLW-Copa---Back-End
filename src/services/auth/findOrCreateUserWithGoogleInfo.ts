import { User } from '@prisma/client';
import { prisma } from './../../lib/database';
import { UserGoogleInfo } from "./getUserInfoWithGoogleAccessToken";

export async function findOrCreateUserWithGoogleInfo(userInfo: UserGoogleInfo): Promise<User> {
   let user = await prisma.user.findUnique({
      where: {
         googleId: userInfo.id
      }
   })

   if(!user) {
      user = await prisma.user.create({
         data: {
            name: userInfo.name,
            email: userInfo.email,
            googleId: userInfo.id,
            avatarUrl: userInfo.picture
         }
      })
   }

   return user;
}