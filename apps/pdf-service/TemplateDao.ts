import mongoose from 'mongoose'
const { Schema } = mongoose;
import PDFTemplate from "types";


const TemplateSchema = new Schema({
    _id: String,
    userId: String,
    template: String
})

const templateModel = mongoose.model('template', TemplateSchema);


export default class TemplateDao {
    static async getTemplate({userId, templateId}: { userId: string, templateId: string }): Promise<PDFTemplate | null> {
        const body = await templateModel.findOne({userId, _id:templateId})
        return body?.template as unknown as PDFTemplate | null
    }

    static async getTemplatesByUserId({userId}): Promise<PDFTemplate[]> { 
        const body = await templateModel.find({userId})
        return ( body  || []) as unknown as PDFTemplate[] 
    }

    static async insertTemplate({userId, templateId, template}: {userId: string, templateId: string, template: string}){
        const templateDocument = new templateModel({
          _id: templateId, userId, template
        })


        await templateDocument.save()
    }

    static async updateTemplate({userId, templateId, template}: {userId: string, templateId: string, template: string}){
        await templateModel.updateOne({_id:templateId, userId}, {template})
    }

}

