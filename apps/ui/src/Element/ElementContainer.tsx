import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { Resizable } from './Resizable';
import { colors } from '../ui/constants';
import { useShiftKeyPressed } from './useShftKeyPressed';
import { selectElement, unlockElement, unselectElement } from '../reducers/componentInteractions';
import { RootState } from '../reducers';
import { getElement } from '../selectors';

const Container = styled.div<{width:number, height:number, mouseDown: boolean; isSelected: boolean}>`
    width:100%;
    height:100%;
    box-sizingA: border-box;     
    position:absolute;
    ${(props) => (props.isSelected ? `border: 2px solid ${colors.primary}` : '')}

    ${(props) => props.mouseDown
        && css`
            transform: scale(1.2);
            box-shadow: 0 8px 20px 0 rgba(0, 0, 0, 0.3);
        `}
`;

const InnerContainer = styled.div`
    width: 100%;
    height: 100%;
    box-sizingA: border-box;     
    overflow: hidden;
`;

type ElementProps = {
    id: string
    style?: React.CSSProperties
}

/**
 * Provides the basic styling and common functionality
 * (dragging / resizing / mouseDown state / selected state) for Elements.
 */
export const ElementContainer: React.FC<ElementProps> = ({ id, style, children }) => {
  //   const element = useRecoilValue(elementState(id))
  const dispatch = useDispatch();
  const isSelected = useSelector((state: RootState) => state.templateSlice.selectedElement?.elementId === id);
  const element = useSelector((state: RootState) => getElement(state.templateSlice, id));

  const [mouseDown, setMouseDown] = useState(false);
  // const setSelectedElement = useSetRecoilState(selectedElementIdsState)
  // const isSelected = useRecoilValue(isSelectedState(id))
  const shiftKeyPressed = useShiftKeyPressed();
  let timer: NodeJS.Timeout| null = null;

  if (!element) {
    return <div> Element not found! </div>;
  }

  return (
    <div style={{ ...style, boxSizing: 'border-box' }}>
      <Resizable id={id} element={element} isSelected={isSelected}>
        <Container
          width={element.width}
          height={element.height}
          mouseDown={mouseDown}
          isSelected={isSelected}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onMouseDown={(e) => {
            if (!isSelected && !element.isLocked) {
              dispatch(selectElement(id));
            } else if (element.isLocked) {
              dispatch(unselectElement());
            }
            if (element.isLocked) {
              timer = setTimeout(() => {
                if (element.isLocked) {
                  dispatch(unlockElement(id));
                  dispatch(selectElement(id));
                }
              }, 2000);
            }
          }}

          onMouseUp={() => {
            if (timer) {
              clearInterval(timer);
            }
          }}
        >
          <InnerContainer>{children}</InnerContainer>
        </Container>
      </Resizable>
    </div>
  );
};
