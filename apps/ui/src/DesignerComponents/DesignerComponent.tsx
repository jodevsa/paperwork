import React from 'react';
import { PDFElement } from 'types';


export abstract class DesignerComponent {
    abstract type: String

    abstract icon:(props: any) => JSX.Element;

    lockAspectRatio: boolean = false

    resizeSettings:{
        minWidth?: number,
        minHeight?:number,
        lockAspectRatio?:boolean,
        maxWidth?:number,
        maxHeight?:number
    } = {}

    containerStyle ={
    }

    abstract defaultElement: PDFElement

    defaultStyle = {
      top: 20,
      left: 20,
      width: 200,
      height: 170,
      rotateAngle: 0,
    }

    abstract renderProperties(state: any, setSelectedElement: (valOrUpdater: (((currVal: any) => any) | any)) => void): JSX.Element

    abstract render(element: any):JSX.Element
}
