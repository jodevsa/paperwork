import createPdf from '../../createPdf';
import { runDocTest } from './helpers';

jest.setTimeout(20000)

describe("rectangle",  () => {
    test("rotate", async () => {
        return await runDocTest(function (doc) {
            const config = {"preview":{"url":"blob:https://dev.pdfmaker.local/9394182e-7aac-4db5-a52e-bd9e42998880","isLoading":false},"selectedElement":{"elementId":"cGz7LpRe8JCyQ7lG3Lo9J","alignmentLines":[]},"pages":{"0":{"pageSize":"A4","elements":{"cGz7LpRe8JCyQ7lG3Lo9J":{"isLocked":false,"id":"cGz7LpRe8JCyQ7lG3Lo9J","type":"rectangle","width":200,"height":200,"location":{"page":"0","point":{"x":164,"y":107}},"color":"#001","rotateAngle":52}}}}}
            createPdf(doc, config)
        })
    })

    test("width and height", async () => {
        return await runDocTest(function (doc) {
            createPdf(doc, { "preview": { "url": "blob:https://dev.pdfmaker.local/78371a1f-180a-4ea3-857c-47de371a544c", "isLoading": false }, "selectedElement": { "elementId": "Qza9PgnJbGmqKnKCt0O_N", "alignmentLines": [] }, "pages": { "0": { "pageSize": "A4", "elements": { "Qza9PgnJbGmqKnKCt0O_N": { "isLocked": false, "id": "Qza9PgnJbGmqKnKCt0O_N", "type": "rectangle", "width": 200, "height": 200, "location": { "page": "0", "point": { "x": 161, "y": 73 } }, "color": "#001", "rotateAngle": 0 } } } } })

        })
    })


    test("top and left", async() => {
        return await runDocTest(function (doc) {
            createPdf(doc, {"preview":{"url":"blob:https://dev.pdfmaker.local/eab0891a-782a-4ab7-b4cc-3013fe0e4878","isLoading":false},"selectedElement":{"elementId":"cGz7LpRe8JCyQ7lG3Lo9J","alignmentLines":[[{"x":594,"y":1123},{"x":794,"y":1123}],[{"x":594,"y":1123},{"x":0,"y":1123}],[{"x":794,"y":923},{"x":794,"y":0}],[{"x":794,"y":923},{"x":794,"y":1123}],[{"x":794,"y":1123},{"x":794,"y":0}],[{"x":794,"y":1123},{"x":794,"y":1123}],[{"x":794,"y":1123},{"x":0,"y":1123}]]},"pages":{"0":{"pageSize":"A4","elements":{"cGz7LpRe8JCyQ7lG3Lo9J":{"isLocked":false,"id":"cGz7LpRe8JCyQ7lG3Lo9J","type":"rectangle","width":200,"height":200,"location":{"page":"0","point":{"x":594,"y":923}},"color":"#5050a8","rotateAngle":0}}}}})

        })
    })
})