
import {fastifyServer, mongooseConnect} from "service-core";
import createPdf from "./createPdf";
import TemplateDao from './TemplateDao';
const server = fastifyServer()
import PDFTemplate from "types";
import { v4 as uuidv4 } from 'uuid';
import PDFDocument from "pdfkit";


const templateDao = new TemplateDao()

server.post('/api/generate',async (request, reply) => {
  const data = request.body;

  const doc = new PDFDocument({ size: "A4" });

  reply
  .code(200)
  .header('Access-Control-Allow-Origin', '*')
  .header('Content-Type', 'application/pdf')
  .send(createPdf(doc,data))
})



server.post('/api/template/create',async (request, reply) => {
  // @ts-ignore
  const userId = request.user?.sub?.split("|")[1]
  const templateId = uuidv4();
  await templateDao.insertTemplate({
    userId,
    templateId,
    template: JSON.stringify({ pages: { 0: { pageSize: 'A4', elements: {} } } })
  })

  reply.send({userId, templateId})
})



server.get('/api/template/:templateId',async (request, reply) => {
  // @ts-ignore
  const templateId = request.params?.templateId

  const user = request.user
  // @ts-ignore
  const userId = request.user?.sub?.split("|")[1]

  const template = await templateDao.getTemplate({userId, templateId})

  reply.send(template)
})




server.get('/api/templates', async (request, reply) => {
  const user = request.user
  // @ts-ignore
  const userId = request.user?.sub?.split("|")[1]

  const templates = await templateDao.getTemplatesByUserId({userId})
  
  reply.send(templates)
})


server.put('/api/template/:templateId',async (request, reply) => {
  const template: PDFTemplate = request.body as PDFTemplate
  // @ts-ignore
  const templateId = request.params?.templateId

  // @ts-ignore
  const userId = request.user?.sub?.split("|")[1]

  await templateDao.updateTemplate({userId, templateId, template: JSON.stringify(template)})

  reply.send(template)
})


const start = async () => {
  try {
    await server.listen(8080, '0.0.0.0')

    const address = server.server.address()
    const port = typeof address === 'string' ? address : address?.port

    console.log(`starting on ${port}`)
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}
start()



