export class ResponseErrorException extends Error {
   statusCode: number;

   constructor(code: number, message: string) {
      super(message);
      this.statusCode = code
   }
}