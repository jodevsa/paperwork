
import {fastifyServer, mongooseConnect} from "service-core";
import createPdf from "./createPdf";
import TemplateDao from './TemplateDao';
const server = fastifyServer()
import PDFTemplate from "types";
import { v4 as uuidv4 } from 'uuid';
import PDFDocument from "pdfkit";


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
  const userId = request.user._id
  const templateId = uuidv4();
  await TemplateDao.insertTemplate({
    userId,
    templateId,
    template: JSON.stringify({ pages: { 0: { pageSize: 'A4', elements: {} } } })
  })

  reply.send({userId, templateId})
})



server.get('/api/template/:templateId',async (request, reply) => {
  // @ts-ignore
  const templateId = request.params?.templateId

  // @ts-ignore
  const userId = request.user._id

  const template = await TemplateDao.getTemplate({userId, templateId})

  reply.send(template)
})




server.get('/api/templates', async (request, reply) => {
  // @ts-ignore
  const userId = request.user._id

  const templates = await TemplateDao.getTemplatesByUserId({userId})
  
  reply.send(templates)
})


server.put('/api/template/:templateId',async (request, reply) => {
  const template: PDFTemplate = request.body as PDFTemplate
  // @ts-ignore
  const templateId = request.params?.templateId

  // @ts-ignore
  const userId = request.user._id

  await TemplateDao.updateTemplate({userId, templateId, template: JSON.stringify(template)})

  reply.send(template)
})


const start = async () => {
  try {

    // connect to mongodb
    await mongooseConnect()

    await server.listen(8080, '0.0.0.0')

    const address = server.server.address()
    const port = typeof address === 'string' ? address : address?.port

    console.log(`starting on ${port}`)
  } catch (err) {
    console.log(err)
    server.log.error(err)
    process.exit(1)
  }
}
start()



