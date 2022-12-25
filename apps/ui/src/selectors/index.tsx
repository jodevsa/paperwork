import { RootState } from '../reducers';
import {Point, PDFElement, PDFTemplate, PDFTemplateState} from "types";


function getElementPage({template}: PDFTemplateState, id: string): string | null {
  for (const pageKey in template.pages) {
    const { elements } = template.pages[pageKey];
    for (const elementKey in elements) {
      const element = elements[elementKey];
      return pageKey;
    }
  }
  return null;
}

function getElement({template}: PDFTemplateState, id: string): PDFElement | null {
  for (const pageKey in template.pages) {
    const { elements } = template.pages[pageKey];
    for (const elementKey in elements) {
      const element = elements[elementKey];
      if (element.id === id) {
        return element;
      }
    }
  }
  return null;
}

function getSelectedElement(state: PDFTemplateState): PDFElement | null {
  const template = state.template
  const selected = state.selectedElement;

  if (!selected) {
    return null;
  }
  return getElement(state, selected.elementId);
}

function getElementIds(state: RootState, pageNumber: number): string[] {
  if(!state.templateSlice.template){
    return [];
  }

  return Object.keys(state.templateSlice.template.pages[pageNumber].elements);
}
function getElementPoints(element: PDFElement) {
  const left = element.location.point.x;

  const top = element.location.point.y;
  const { width } = element;
  const right = left + width;

  const { height } = element;
  const bottom = top + height;
  /*
  width:794px;
    height: 1123px; */
  return [
    { x: (left + right) / 2, y: (top + bottom) / 2 },
    { x: left, y: top },
    { x: left, y: bottom },
    { x: right, y: top },
    { x: right, y: bottom }];
}
function getOtherElementsHotPoints(state: PDFTemplateState): Point[] {
  const { template, selectedElement } = state;
  const pageCorners = [{ x: 0, y: 0 },
    { x: 794, y: 0 },
    { x: 794, y: 1123 },
    { x: 0, y: 1123 }];
  if (!selectedElement) {
    return pageCorners;
  }
  const currentPageId = getElementPage(state, selectedElement.elementId);
  if (!currentPageId) {
    return pageCorners;
  }

  const elementsInPage = Object.values(template.pages[currentPageId].elements)
    .filter((element) => element.id !== selectedElement.elementId);

  return [...pageCorners, ...elementsInPage.flatMap((element) => getElementPoints(element))];
}

export {
  getElementPoints,
  getOtherElementsHotPoints,
  getElement, getSelectedElement, getElementIds, getElementPage,
};
