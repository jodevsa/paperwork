// @ts-nocheck
import PDFDocument from "pdfkit";
import request from "request";
import concat from "concat-stream";
import {processHtml} from "./htmlParser.js"

const fetchImage = async (src: string) => new Promise(async (resolve, reject) => {
    console.time(`loading:${src}`);
    const image = await request(src);

    return image.pipe(concat((buffer) => {
        console.timeEnd(`loading:${src}`);
        resolve(buffer);
    }));
});

export default function createPdf(doc, json) {
    console.time('pdf')
    process.nextTick(async ()=>{
        for (const page of Object.values(json.pages)) {

            for (const element of Object.values(page.elements)) {
                doc.save();
                const timeLabel = `${element.type}:${element.id}`;
                console.time(timeLabel);
                const left = element.location.point.x * 0.75;
                const top = element.location.point.y * 0.75;
                const width = element.width * 0.75;
                const height = element.height * 0.75;

                const right = left + width;
                const bottom = top + height;
                const rotationAngle = (element.rotateAngle || 0);
                const rotateOptions = { origin: [left + width / 2, top + height / 2] };

                const { type } = element;

                if (rotationAngle) {
                    doc.rotate(rotationAngle, rotateOptions);
                } else {
                    doc.rotate(0);
                }
                if (type === 'image') {
                    const image = await fetchImage(element.url);
                    doc.image(image, left, top, {
                        width,
                        height,
                        align: 'left',
                    });
                } else if (type === 'text') {
                    const settings =  { left, top, width, height};

                    processHtml(element.text, doc, settings);
         /*           doc.text(element.text, left, top, {
                        width,
                        height
                    })
*/
                } else {
                    doc
                        .moveTo(left, top)
                        .lineTo(right, top)
                        .lineTo(right, bottom)
                        .lineTo(left, bottom)
                        .lineTo(left, top)
                        .fill(element.color);
                }

                doc.restore();
                console.timeEnd(timeLabel);
            }
            doc.end();
        }

        console.timeEnd('pdf');
        

    });
    return doc;
}