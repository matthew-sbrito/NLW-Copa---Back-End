import Fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'

import { router } from './routes/main.routes';

async function bootstrap() {

    const fastify = Fastify({
        logger: true
    })

    try {
        await fastify.register(cors, {
            origin: true
        })

        // VARIÁVEL DE AMBIENTE
        await fastify.register(jwt, {
            secret: process.env.JWT_SECRET ?? ''
        })

        await router(fastify)

        await fastify.listen({ port: 3333, host: '0.0.0.0' })
    } catch (error) {
        fastify.log.error(error)

        process.exit(1)
    }
}

bootstrap();