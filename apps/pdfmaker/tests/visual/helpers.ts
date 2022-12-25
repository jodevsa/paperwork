// @ts-nocheck

import PDFDocument from 'pdfkit';
import { pdf2png } from './pdf2png';
import { configureToMatchImageSnapshot } from 'jest-image-snapshot'


const toMatchImageSnapshot = configureToMatchImageSnapshot({
  noColors: true,
});
expect.extend({ toMatchImageSnapshot });

function runDocTest(options, fn?: any) {
  if (typeof options === 'function') {
    fn = options;
    options = {};
  }
  if (!options.info) {
    options.info = {};
  }

  return new Promise(resolve => {
    const doc = new PDFDocument(options);
    const buffers = [];

    fn(doc);

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', async () => {
      const pdfData = Buffer.concat(buffers);
      const { systemFonts = false } = options;
      const images = await pdf2png(pdfData);
      for (let image of images) {
        expect(image).toMatchImageSnapshot();
      }
      resolve();
    });
  });
}

export { runDocTest };