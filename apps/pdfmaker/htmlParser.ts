// @ts-nocheck
const parser = require('parse5');
const fs = require('fs');
const _ = require('lodash');
const PDFDocument = require('pdfkit');

function extractNumberFromString(string) {
  return Number(Array.from(string).filter((e) => isFinite(e)).join(''));
}

const html = `<span
style="font-size: 30px;"> hey </span>
<strong> hey </strong>
`.trim();

function componentToHex(c) {
  var hex = Number(c).toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function convertColor(string){
const regex = /rgb\((?<r>\d+),(?<g>\d+),(?<b>\d+)\)/

  const { groups: {r,g,b}} = regex.exec(string)

  return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`
}



function parseStyleAttribute(element) {
  const options = {}

  const attrs = element.attrs || [];
  for(const {name, value} of attrs){
    if(!value){
      continue;
    }
    const styles = value.split(";")

    for( const style of styles){
      if(!style){
        continue;
      }
      const [key, styleValue] = style.split(":")


      options[key.trim()] = styleValue.trim();

    }


  }
return options;
}
export function processHtml(html, doc, options) {
  const parsed = parser.parseFragment(html);
  processNodes(parsed.childNodes, doc, options)
  }


  function processNodes(nodes, doc, options){
    for(const node of nodes){
      processNode(node, doc, {...options})
    }

  }
  
  function processNode(node, doc, options) {

    if(node.nodeName === 'del'){
      processNodes(node.childNodes, doc, {...options, strike:true})

    }

    if(node.nodeName === "em"){
      processNodes(node.childNodes, doc, {...options, em:true})
    }
    if(node.nodeName  === "ins"){
      processNodes(node.childNodes, doc, {...options, underline:true})

    }
    if(node.nodeName === "p"){
      processNodes(node.childNodes, doc, {...options})
      doc.text('\n ', { continued: true });
    }
    if(node.nodeName ==="strong"){
      doc.font('Courier-Bold');
      processNodes(node.childNodes, doc, {...options})
      doc.font('Courier');
    }

    if(node.nodeName === "span"){
      const style=parseStyleAttribute(node)
        console.log(style)
      

      if(style["color"]){
        console.log("wooot")
        console.log(convertColor(style["color"]))
        doc.fillColor(convertColor(style["color"]));
      }
      if(style["font-size"]){
      doc.fontSize(extractNumberFromString(style['font-size']));
      }

      processNodes(node.childNodes, doc, {...options})
      doc.fontSize(16);
      doc.fill('black');
    }


    if(node.nodeName === "#text"){
      const settings = { top:options.top, left: options.left, width: options.width, height:options.height, strike: false, em:false, underline:false, continued: true}
      if(options.underline){
        settings.underline=true
      }

      if(options.em){
        settings.em=true
      }

      if(options.strike){
        settings.strike=true
      }


      doc.text(node.value,settings.left, settings.top, settings)
    }

  }


