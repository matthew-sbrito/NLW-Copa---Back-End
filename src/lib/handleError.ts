import { ZodError } from 'zod';
import { ResponseErrorException } from './ResponseErrorException';

export function handleError(error: any): ResponseErrorException {
   if(error instanceof ResponseErrorException) {
      return error
   }

   if(error instanceof ZodError) {
      return new ResponseErrorException(400, 'The params is incorrect!')
   }
   
   return new ResponseErrorException(500, 'Unknow error!')
}