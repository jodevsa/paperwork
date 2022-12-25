import * as dynamoose from "dynamoose"
import {ModelType} from "dynamoose/dist/General";
import {Document} from "dynamoose/dist/Document";
import PDFTemplate from "types";

class Template extends Document {
    userId: string;
    templateId: string;
    template: string
}


export default class TemplateDao {
    private model: ModelType<Template>;
    constructor(){
        const documentConfig = {
            "userId": {type: String, hashKey:true},
            "templateId": {type: String, rangeKey: true},
            "template": {type: String}
        }
        this.model = dynamoose.model<Template>("PDFTemplate", documentConfig, {create: true});
    }

    async getTemplate({userId, templateId}: { userId: string, templateId: string }): Promise<PDFTemplate | null> {
        const body = await this.model.get({userId, templateId})
        return body?.template as unknown as PDFTemplate | null
    }

    async getTemplatesByUserId({userId}): Promise<PDFTemplate[]> { 
        const body = await this.model.query("userId").eq(userId).all(0,100).exec()
        return ( body  || []) as unknown as PDFTemplate[] 
    }

    async insertTemplate({userId, templateId, template}: {userId: string, templateId: string, template: string}){
        await this.model.create({userId, templateId, template})
    }

    async updateTemplate({userId, templateId, template}: {userId: string, templateId: string, template: string}){
        await this.model.update({userId, templateId}, {template})
    }

}

