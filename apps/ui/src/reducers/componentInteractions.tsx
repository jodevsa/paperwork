import {
  createAsyncThunk, createSlice, PayloadAction,
} from '@reduxjs/toolkit';
import {
  getElement, getElementPage, getElementPoints, getOtherElementsHotPoints, getSelectedElement,
} from '../selectors';
import PDFTemplate, {ElementId, PageId, Point, PDFElement, PDFTemplateState} from "types";
import {Page} from "types";
import {getLink} from "../utils";
import { RootState } from '.';

const initialState = {preview: { url: null, isLoading: false }, selectedElement: null, template: null } as PDFTemplateState;



function getTextSize(text: string, fontSize: string):{width:number, height:number} {
  const div = document.createElement('div');
  div.style.visibility = 'hidden';
  div.innerHTML = text;

  const body = document.getElementsByTagName('body')[0];
  body.appendChild(div);
  const result = { width: div?.offsetWidth || 0, height: div?.offsetHeight || 0 };
  body.removeChild(div);
  return result;
}

function getImageSize(src: string):Promise<{width:number, height:number}> {
  return new Promise((resolve, reject) => {
    const img = document.createElement('img');
    img.style.visibility = 'hidden';
    img.src = src;
    const body = document.getElementsByTagName('body')[0];
    body.appendChild(img);
    img.onload = () => {
      const result = { width: img?.naturalWidth || 0, height: img?.naturalHeight || 0 };
      body.removeChild(img);
      resolve(result);
    };
  });
}

export const changeImageUrl = createAsyncThunk(
  'template/changeImageUrl', async ({ id, src }:{ id: string, src: string }, thunkAPI) => {
    const { width, height } = await getImageSize(src);
    return {
      id, src, width, height,
    };
  }
);

function alignDrag(currentPoint: Point, currentElementPoints: Point[], otherElementsPoints: Point[]): Point {
  let x = 0;
  let y = 0;
  const threshold = 4;
  for (const point of currentElementPoints) {
    for (const otherPoint of otherElementsPoints) {
      if (point.x === otherPoint.x && point.y === otherPoint.y) {
        continue;
      }
      const diffX = Math.abs(point.x - otherPoint.x);
      const diffY = Math.abs(point.y - otherPoint.y);
      if (diffX < threshold && x === 0) {
        x = diffX;
        if (point.x > otherPoint.x) {
          x *= -1;
        }
      }

      if (diffY < threshold && y === 0) {
        y = diffY;
        if (point.y > otherPoint.y) {
          y *= -1;
        }
      }
    }
  }
  return { x: currentPoint.x + x, y: currentPoint.y + y };
}


function getAlignmentVisualLines(selectedElementPoints: Point[], otherElementsPoints: Point[]) {
  const lines:Point[][] = [];
  for (const selectedPoint of selectedElementPoints) {
    for (const otherPoint of otherElementsPoints) {
      if (selectedPoint.x === otherPoint.x
        || selectedPoint.y === otherPoint.y) {
        lines.push([selectedPoint, otherPoint]);
      }
    }
  }
  return lines;
}

export const generatePreviewPDF = createAsyncThunk(
  'template/generatePreviewPDF', async ({state}:{state:PDFTemplateState}, thunkAPI) => {

    const token: RootState = thunkAPI.getState().appSlice.jwtToken
    const data = await fetch("http://localhost:8080/api/generate", { method: 'POST',
      body: JSON.stringify(state.template), headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
    } });

    return URL.createObjectURL(await data.blob());
  },
);

export const loadTemplate = createAsyncThunk(
  'template/loadFromServer', async ({templateId}:{templateId:string}, thunkAPI) => {
    
    const token: RootState = thunkAPI.getState().appSlice.jwtToken
    const data = await fetch(getLink(`/api/template/${templateId}`), { method: 'GET',
       headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
    } });

    const template = await data.json();
    return template;
  },
);


export const saveTemplate = createAsyncThunk(
  'template/save', async ({template, templateId,token}:{template: PDFTemplate, templateId:string, token: string}, thunkAPI) => {
    const data = await fetch(getLink(`/api/template/${templateId}`), { method: 'PUT',
    body: JSON.stringify(template),
       headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
    } });
  },
);

const templateSlice = createSlice({
  name: 'template',
  initialState,
  reducers: {
    selectElement(state, action: PayloadAction<string>) {
      const id = action.payload;
      state.selectedElement = { elementId: id, alignmentLines: [] };
    },

    unselectElement(state) {
      if (state.selectedElement !== null) {
        state.selectedElement = null;
      }
    },
    clearVisualLines(state) {
      const { selectedElement } = state;
      if (selectedElement) {
        selectedElement.alignmentLines = [];
      }
    },

    lockElement(state, action: PayloadAction<string>) {
      const id = action.payload;
      const element = getElement(state, id);

      if (element) {
        element.isLocked = true;
        state.selectedElement = null;
      }
    },

    unlockElement(state, action: PayloadAction<string>) {
      const id = action.payload;
      const element = getElement(state, id);

      if (element) {
        element.isLocked = false;
        state.selectedElement = null;
      }
    },

    rotateElement(state, action: PayloadAction<{id: string; rotateAngle: number}>) {
      const { id, rotateAngle } = action.payload;

      if (id !== state.selectedElement?.elementId) {
        return;
      }

      const element = getElement(state, id);

      if (!element) {
        return;
      }

      element.rotateAngle = rotateAngle;
    },

    resizeElement(
      state,
      action: PayloadAction<{id: string; top: number; left: number; width: number; height: number}>,
    ) {
      const {
        id, width, height, top, left,
      } = action.payload;

      if (id !== state.selectedElement?.elementId) {
        return;
      }

      const element = getElement(state, id);

      if (!element) {
        return;
      }

      element.width = width;
      element.height = height;

      element.location.point.x = left;
      element.location.point.y = top;
    },

    changeTextColor(state, action: PayloadAction<{id:string, color:string}>) {
      const element = getElement(state, action.payload.id);

      if (element && element.type === 'text') {
        element.textColor = action.payload.color;
      }
    },

    changeTextValue(state, action: PayloadAction<{id:string, text:string}>) {
      const element = getElement(state, action.payload.id);

      if (element && element.type === 'text') {
        const { width, height } = getTextSize(action.payload.text, '15pt');

        console.log(width, height);
        element.text = action.payload.text;
      }
    },

    changeRectangleColor(state, action: PayloadAction<{id:string, color:string}>) {
      const element = getElement(state, action.payload.id);

      if (element && element.type === 'rectangle') {
        element.color = action.payload.color;
      }
    },

    resetTemplatePage(state){
        state.preview = {url:null, isLoading:false}
        state.template = null;

    },

    moveElement(state, action: PayloadAction<{id: string; point: Point}>) {
      const { id, point } = action.payload;

      const element = getElement(state, id);
      if (!element) {
        return;
      }

      element.location.point.x = point.x;
      element.location.point.y = point.y;

      const alignmentPoints = getOtherElementsHotPoints(state);

      const alignedPoint = alignDrag(point, getElementPoints(element), alignmentPoints);

      element.location.point.x = alignedPoint.x;
      element.location.point.y = alignedPoint.y;

      if (id !== state.selectedElement?.elementId) {
        return;
      }

      if (state.selectedElement) {
        const visualLines = getAlignmentVisualLines(getElementPoints(element), alignmentPoints);
        state.selectedElement.alignmentLines = visualLines;
      }
    },

    addElement(state, action: PayloadAction<PDFElement>) {
      const element = action.payload;
      const { template } = state

      if (template?.pages[element.location.page]) {
        template.pages[element.location.page].elements[element.id] = element;
      }
    },
    deleteElement(state, action: PayloadAction<ElementId>) {
      const pageNumber = getElementPage(state, action.payload);
      if (pageNumber) {
        delete state.template?.pages[pageNumber].elements[action.payload];
      }
    },
    addPage({template}, action: PayloadAction<Page>) {
      if(!template){
        return;
      }
      const newPageNumber = String(Math.max(...Object.keys(template?.pages).map((e) => Number(e))) + 1);
      template.pages[newPageNumber] = action.payload;
    },
  },
  extraReducers: (builder)=> {


    builder.addCase(loadTemplate.fulfilled, (state, action)=> {
        state.template = action.payload;
    })

    builder.addCase(generatePreviewPDF.pending, (state, action) => {
      state.preview.isLoading = true;
    });

    builder.addCase(generatePreviewPDF.fulfilled, (state, action) => {
      state.preview.isLoading = false;
      state.preview.url = action.payload
    });


    builder.addCase(changeImageUrl.fulfilled,(state, action: PayloadAction<{id:string, src:string, width:number, height:number}>) => {
      const {
        id, src, width, height,
      } = action.payload;
      const element = getElement(state, id);

      if (element && element.type === 'image') {
        element.width = width;
        element.height = height;
        element.url = src;
      }
    })
  
  }
});



export default templateSlice.reducer;
export const {
  resetTemplatePage,
  unlockElement,
  lockElement,
  addPage,
  addElement,
  moveElement,
  selectElement,
  unselectElement,
  rotateElement,
  resizeElement,
  changeRectangleColor,
  changeTextColor,
  changeTextValue,
  deleteElement,
  clearVisualLines,
} = templateSlice.actions;
