import Fastify, { FastifyInstance } from 'fastify'
import cors from '@fastify/cors'
import mongoose from 'mongoose'
import fastifyJwt from '@fastify/jwt'
import fastifyCookie from '@fastify/cookie'


type Config = {unauthenticatedRoutes?: Set<string>}


export const JWT_COOKIE_TOKEN = "JWT"

export function fastifyServer(config: Config = {}): FastifyInstance {


    const publicKey = process.env.JWT_PUBLIC_KEY
    const privateKey = process.env.JWT_PRIVATE_KEY

    if(!publicKey){
        throw new Error("mandatory JWT_PUBLIC_KEY env variable is not set")
    }

    if(!publicKey){
        throw new Error("mandatory JWT_PRIVATE_KEY env variable is not set")
    }

    const unauthenticatedRoutes = config?.unauthenticatedRoutes || new Set()
    unauthenticatedRoutes.add("/health")

    const server: FastifyInstance = Fastify({})

    server.register(fastifyJwt, {
        secret: privateKey
    })


    server.register(cors, {
        // put your options here
    })


    server.addHook('onRequest', async (request, reply) => {
        if (unauthenticatedRoutes.has(request.routerPath)) {
            // do nothing
            return
        }

        // check the JWT token
        try{
            await request.jwtVerify()
        }
        catch(e){
            reply.send(e)
        }
    })

    server.get('/health', async (request, reply) => {
        reply
            .code(200)
            .send({up: true})
    })

    return server
}


let db;

export async function mongooseConnect() {
    if(!db) {
        const url = process.env.MONGODB_URL

        if (!url) {
            throw new Error("mandatory MONGODB_URL env variable is not set")
        }

        db = await mongoose.connect(url);
    }

    return db
}