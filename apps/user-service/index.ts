import {fastifyServer, mongooseConnect, JWT_COOKIE_TOKEN} from "service-core";
import mongoose from 'mongoose';
const { Schema } = mongoose;
import { Static, Type } from '@sinclair/typebox'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'

const UserSchema = new Schema({
    name: String,
    email: String,
    // TODO: password hashing
    password: String
})

const userModel = mongoose.model('User', UserSchema);

const server = fastifyServer({unauthenticatedRoutes:new Set(["/api/browser/login"])})


export const LoginBody = Type.Object({
    email: Type.String(),
    password: Type.String()
  })
  
  export type LoginBodyType = Static<typeof LoginBody>

server.post<{
    Body:LoginBodyType
}>('/api/browser/login',async (request, reply) => {

    const {email, password} = request.body
    const exists = await userModel.exists({email, password})
    if(!exists){
        // 401 Unauthorized
        reply.code(401).send({"message":"wrong email/password"})
    }


    const token = server.jwt.sign({_id:exists._id, email, password})
    reply
 .setCookie(JWT_COOKIE_TOKEN, token, {
        domain: 'localhost',
        path: '/',
        secure: true, // send cookie over HTTPS only
        httpOnly: true,
        sameSite: true // alternative CSRF protection
      })
        .code(200)
        .header('Content-Type', 'application/json')
        .send({token})

})


const start = async () => {
    try {

        // connect to mongoose
        await mongooseConnect()

        const exists = await userModel.exists({email:"admin@admin.com"})
        if(!exists){
            const doc = new userModel({email:"admin@admin.com", password:"password", name:"test"})
            await doc.save()
        }
        await server.listen(8080, '0.0.0.0')

        const address = server.server.address()
        const ip = typeof address === 'string' ? address : address?.address
        const port = typeof address === 'string' ? address : address?.port

        console.log(`starting on ${ip}:${port}`)
    } catch (err) {
        server.log.error(err)
        console.log(err)
        process.exit(1)
    }
}

start()
