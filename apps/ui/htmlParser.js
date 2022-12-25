const parser = require('parse5');
const fs = require('fs');
const _ = require('lodash');
const PDFDocument = require('../pdfkit/js/pdfkit');

function extractNumberFromString(string) {
  return Number(Array.from(string).filter((e) => isFinite(e)).join(''));
}

const html = `<p>hello world<strong>!</strong></p>
<p></p>
<p></p>
<p><strong>_aa. </strong><span
style="font-size: 30px;">qwqwe</
span></p>
<p></p>

<p><ins>hello world!</ins></p>
<p><span style="font-size:
9px;">www</span></p>`.trim();

function parseStyleAttribute(element) {
  return (element.attrs || []).map((e) => e.value.split(':')).reduce((acc, el) => {
    acc[el[0].trim()] = el[1].trim();
    return acc;
  }, {});
}
function parseHtml(html) {
  const parsed = parser.parseFragment(html);
  const array = [];
  for (const element of parsed.childNodes) {
    if (element.tagName === 'p') {
      array.push({ type: 'text', instructions: _.flatten(element.childNodes.flatMap((child) => parseElement(child, { bold: false, underline: false, strike: false }).flatMap((e) => e))).flatMap((e) => e) });
    }
  }
  console.log(JSON.stringify(array));
  return array;
}

function parseElement(element, existingOptions) {
  const attr = parseStyleAttribute(element);
  switch (element.tagName) {
    case 'strong': {
      return element.childNodes.map((child) => parseElement(child, { ...existingOptions, bold: true, ...attr }));
    }
    case 'em': {
      return element.childNodes.map((child) => parseElement(child, { ...existingOptions, em: true, ...attr }));
    }
    case 'del': {
      return element.childNodes.map((child) => parseElement(child, { ...existingOptions, strike: true, ...attr }));
    }
    case 'ins': {
      return element.childNodes.map((child) => parseElement(child, { ...existingOptions, underline: true, ...attr }));
    }
    case 'span': {
      return element.childNodes.map((child) => parseElement(child, { ...existingOptions, ...attr }));
    }
    default: {
      if (element.nodeName === '#text') {
        return [{ ...existingOptions, value: element.value, ...attr }];
      }
      return [existingOptions];
    }
  }
}
const drawHTML = ({
  doc, html, width, height, left, top,
}) => {
  doc.text('', left, top, { width, height });
  const all = parseHtml(html);
  for (const line of all) {
    for (let i = 0; i < line.instructions.length; i++) {
      const instruction = line.instructions[i];
      if (instruction.bold) {
        doc.font('Courier-Bold');
      } else {
        doc.font('Courier');
      }
      if (instruction['font-size']) {
        doc.fontSize(extractNumberFromString(instruction['font-size']));
      } else {
        doc.fontSize(16);
      }
      doc.text(instruction.value, { ...instruction, continued: true });
    }
    doc.text('\n ', { continued: true });
  }
};

module.exports = drawHTML;
