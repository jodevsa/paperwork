import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { debounce } from 'lodash';
import { Element } from './Element/Element';
import { RootState } from './reducers';
import { generatePreviewPDF, PDFTemplate, saveTemplate, unselectElement } from './reducers/componentInteractions';
import { getElementIds } from './selectors';
import { PDFTemplateState } from '../../types/build';

const CanvasContainer = styled.div`
     box-shadow:0 1px 3px 1px rgb(60 64 67 / 15%);
     background-color:white;
     position: relative;
    margin:15px;
    width:794px;
    height: 1123px;
`;


const savePdf = debounce((dispatch, templateId: string, state:PDFTemplateState, token: string) => {
  if(state.template){
  dispatch(saveTemplate({templateId,template: state.template, token}));
  }
}, 250);

const generatePDF = debounce((dispatch, state:PDFTemplateState) => {
  if(state.template){
  dispatch(generatePreviewPDF({state}));
  }
}, 250);

const Canvas: React.FC = ({templateId}: {templateId: string}) => {
  const elementIds = useSelector((state:RootState) => getElementIds(state, 0));
  const state = useSelector((state:RootState) => state.templateSlice);
  const token = useSelector((state:RootState) => state.appSlice.jwtToken);
  const template = useSelector((state:RootState) => state.templateSlice.template);

  const dispatch = useDispatch();
  const canvasContainerRef = useRef<HTMLCanvasElement>(null);
  useEffect(()=>{
    (async () => {
      try {
        generatePDF(dispatch, state, token);
        savePdf(dispatch, templateId, state, token)
      }
      catch(e){
      console.log(e)
      }
  })();

}, [template]);

  useEffect(() => {
    window.requestAnimationFrame(() => {
      const canvas = canvasContainerRef.current;
      if (!canvas || !template) {
        return;
      }
      // @ts-ignore
      canvas.width = canvas.offsetWidth;
      // @ts-ignore
      canvas.height = canvas.offsetHeight;

      const ctx = canvas.getContext('2d');
    ctx?.clearRect(0, 0, canvas.width, canvas.height);

    if (!ctx) {
      return;
    }

    const { selectedElement } = state;
    if (!selectedElement) {
      return;
    }

    for (const [startPoint, endPoint] of selectedElement.alignmentLines) {
      ctx.beginPath();
      ctx.moveTo(startPoint.x, startPoint.y);
      ctx.lineTo(endPoint.x, endPoint.y);
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'red';
      ctx.stroke();
    }
    });
  }, [state.selectedElement?.alignmentLines]); // eslint-disable-line

  const [mouseDown, setMouseDown] = useState({
    down: false, x: 0, y: 0, translate: { x: 0, y: 0 },
  });

  return (
    <CanvasContainer
      id="designer-canvas"
      onClick={() => {
        dispatch(unselectElement());
      }}
    >
      <canvas
        id="drawingCanvas"
        ref={canvasContainerRef}
        style={{ width: '100%', height: '100%' }}
      >
        .
      </canvas>
      {elementIds.map((id) => <Element key={id} id={id} />)}
    </CanvasContainer>

  );
};

export default Canvas;
