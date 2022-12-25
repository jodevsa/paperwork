export type ElementId = string

export type PageId = string

export interface Point {
    x: number
    y: number
}
export interface PDFTemplate {
    pages: {[key: string]: Page}
}


export interface PDFTemplateState {
    template: PDFTemplate | null,
    selectedElement: {elementId:ElementId, alignmentLines:Point[][]} | null,
    preview: {url: string | null, isLoading:boolean}
}

export interface Page {
    pageSize: string
    elements: {[key: string]: PDFElement}
}

export interface ElementLocation {
    point: Point
    page: PageId
}


interface BaseElement {
    id: string
    type: string
    width: number
    height: number
    location: ElementLocation
    rotateAngle: number,
    isLocked: boolean,
}

export interface RectangleElement extends BaseElement {
    type: 'rectangle'
    color: string
}

export interface TextElement extends BaseElement {
    type: 'text'
    text: string
    fontSize: number
    textColor: string
}

export interface ImageElement extends BaseElement {
    type: 'image',
    url: string
}

interface MoveElementPayload {
    id: string
    location: ElementLocation
}

export type PDFElement = RectangleElement | TextElement | ImageElement

export default PDFTemplate


export interface Auth0Config {
    domain: string,
    clientId: string
}

export interface UIConfig {
    auth0: Auth0Config
}

