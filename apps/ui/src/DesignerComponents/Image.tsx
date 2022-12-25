import { GoTextSize } from 'react-icons/go';
import * as React from 'react';
import { useRef, useState } from 'react';
import useOnClickOutside from 'use-onclickoutside';
import TextField from '@material-ui/core/TextField';
import ColorPicker from 'material-ui-color-picker';
import { FormLabel } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import ImageIcon from '@material-ui/icons/Image';
import { DesignerComponent } from './DesignerComponent';
import { capitalizeFirst } from '../utils';
import {
  changeImageUrl,
  changeTextColor, changeTextValue, ImageElement, TextElement,
} from '../reducers/componentInteractions';

type TextProps = {
    id: number
}

type State = {
    text: string
}
type TextComponentState = State

class ImageComponent extends DesignerComponent {
    type = 'image'

    icon = ImageIcon

    defaultElement: ImageElement = {
      isLocked: false,
      type: 'image',
      id: '0',
      url: 'https://via.placeholder.com/300.png/',
      rotateAngle: 0,
      width: 300,
      height: 300,
      location: { page: '0', point: { x: 0, y: 0 } },
    }

    render(element: ImageElement) {
      return <img style={{ width: element.width, height: element.height }} draggable="false" src={element.url} alt="" />;
    }

    renderProperties(selectedElement: ImageElement): JSX.Element {
      const dispatch = useDispatch();
      return (
        <div style={{ objectFit: 'contain', background: 'white', height: '100%' }}>
          <FormLabel component="legend">Image Properties</FormLabel>

          <div>
            <TextField
              type="text"
              label="Text"
              variant="outlined"
              value={selectedElement.url}
              onChange={(e) => {
                dispatch(changeImageUrl({ id: selectedElement.id, src: e.target.value }));
              }}
            />
          </div>
        </div>
      );
    }
}

export default new ImageComponent();
