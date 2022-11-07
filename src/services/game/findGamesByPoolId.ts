import { prisma } from './../../lib/database';

export async function findGamesByPoolId(poolId: string, userId: string) {

   const games = await prisma.game.findMany({
      orderBy: {
         date: 'desc'
      },
      include: {
         guesses: {
            where: {
               participant: {
                  userId,
                  poolId,
               }
            }
         }
      }
   })

   for (const game of games) {
      const date = new Date()

      date.setDate(date.getDate() + 1)

      await prisma.game.update({
         data: { date },
         where: { id: game.id }
      })
   }

   return { 
      games: games.map(game => {
         return {
            ...game,
            guess: game.guesses.length > 0 ? game.guesses[0] : null,
            guesses: undefined
         }
      })
   }
}