import {fastifyServer} from "service-core";


const config = JSON.stringify(JSON.parse(process.env.CONFIG));

const server = fastifyServer({unauthenticatedRoutes:new Set(["/api/config"])})

server.get('/api/config',async (request, reply) => {

    reply
        .code(200)
        .header('Content-Type', 'application/json')
        .send(config)

})


const start = async () => {
    try {
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
