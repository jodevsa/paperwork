import React, { Suspense } from 'react';
import hexToRgba from 'hex-to-rgba';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { ElementContainer } from './ElementContainer';
import { ElementFallback } from './ElementFallback';
import components, { getDesignerComponent } from '../DesignerComponents/components';

import { RootState } from '../reducers';
import { RectangleElement, TextElement } from '../reducers/componentInteractions';
import { getElement } from '../selectors';

export const Element: React.FC<{id: string}> = React.memo(({ id }) => {
  const element = useSelector((state: RootState) => getElement(state.templateSlice, id));

  if (!element) {
    return <div>element not found!!!</div>;
  }

  const backgroundColor = element.type === 'rectangle' ? hexToRgba(element.color, 0.6) : undefined;
  const designerComponent = getDesignerComponent(element.type);
  if (!designerComponent) {
    return <div />;
  }
  // @ts-ignore
  const renderedElement = designerComponent && designerComponent.render(element);
  return (
    <ElementContainer id={element.id} style={{ width: element.width, height: element.height }}>
      <Suspense fallback={<ElementFallback />}>{renderedElement}</Suspense>
    </ElementContainer>
  );
});
