import React from 'react';
import styled, { css } from 'styled-components';
import _ from 'lodash';
import { useDispatch } from 'react-redux';
import { colors } from '../ui/constants';
import { getDesignerComponent } from '../DesignerComponents/components';
// @ts-ignore
import ResizableRect from '../MagicalContainer';
import {
  clearVisualLines,
  Element,
  moveElement,
  RectangleElement,
  resizeElement,
  rotateElement,
  TextElement,
} from '../reducers/componentInteractions';

type Line = {start: number; end: number}

export const Resizable: React.FC<{id: string; element: Element; isSelected: boolean}> = ({
  element,
  children,
  id,
  isSelected,
}) => {
  const dispatch = useDispatch();
  return (
    <ResizableRect
      isSelected={isSelected}
      left={element.location.point.x}
      top={element.location.point.y}
      width={element.width}
      height={element.height}
      rotateAngle={element.rotateAngle}
      onDragEnd={() => {
        dispatch(clearVisualLines());
      }}
      onDrag={(deltaX: number, deltaY: number) => {
        const left = element.location.point.x + deltaX;
        const top = element.location.point.y + deltaY;

        if (isSelected) {
          dispatch(
            moveElement({
              id,
              point: { x: left, y: top },
            }),
          );
        }
      }}
      onRotate={(rotateAngle: number) => {
        dispatch(rotateElement({ id, rotateAngle }));
      }}
      onResize={(style: {top: number; left: number; width: number; height: number}) => {
        const {
          top, left, width, height,
        } = style;

        dispatch(
          resizeElement({
            id,
            width: Math.round(width),
            height: Math.round(height),
            top: Math.round(top),
            left: Math.round(left),
          }),
        );
      }}
      zoomable="n, w, s, e, nw, ne, se, sw"
      lockAspectRatio={false}
    >
      {children}
    </ResizableRect>
  );
};

const Handle = styled.span<{isVisible: boolean}>`
    position: absolute;
    width: 10px;
    height: 10px;
    background-color: ${colors.primaryLight};
    border-radius: 50%;
    opacity: 0;
    pointer-events: none;
    transition: 0.1s opacity ease-in-out;

    ${(props) => props.isVisible
        && css`
            opacity: 1;
            pointer-events: initial;
        `}

    &.handle-sw {
        bottom: 0;
        left: 0;
        cursor: sw-resize;
    }
    &.handle-se {
        bottom: 0;
        right: 0;
        cursor: se-resize;
    }
    &.handle-nw {
        top: 0;
        left: 0;
        cursor: nw-resize;
    }
    &.handle-ne {
        top: 0;
        right: 0;
        cursor: ne-resize;
    }
    &.handle-w,
    &.handle-e {
        top: 50%;
        margin-top: -6px;
        cursor: ew-resize;
    }
    &.handle-w {
        left: -6px;
    }
    &.handle-e {
        right: -6px;
    }
    &.handle-n,
    &.handle-s {
        left: 50%;
        margin-left: -6px;
        cursor: ns-resize;
    }
    &.handle-n {
        top: -6px;
    }
    &.handle-s {
        bottom: -6px;
    }
`;
