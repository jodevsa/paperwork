import { GoTextSize } from 'react-icons/go';
import * as React from 'react';
import { useRef, useState } from 'react';
import useOnClickOutside from 'use-onclickoutside';
import TextField from '@material-ui/core/TextField';
import { useDispatch, useSelector } from 'react-redux';
import { FormLabel } from '@material-ui/core';
import StopIcon from '@material-ui/icons/Stop';
import ColorPicker from 'material-ui-color-picker';
import { capitalizeFirst } from '../utils';
import { changeRectangleColor } from '../reducers/componentInteractions';
import { DesignerComponent } from './DesignerComponent';
import { getSelectedElement } from '../selectors';
import { RootState } from '../reducers';
import { RectangleElement } from 'types';

/*
const colorState = selectorFamily({
    key: 'rectangle',
    get: (id: number) => ({get}) => {
        const element = get(elementState(id))

        return element.color
    },
})
*/

type State = {
    color: string
}
type TextComponentState = State

class Rectangle extends DesignerComponent {
    type = 'rectangle'

    icon = StopIcon

    defaultState: State = { color: 'black' }

    defaultElement: RectangleElement = {
      isLocked: false,
      id: '0',
      type: 'rectangle',
      width: 200,
      height: 200,
      location: { page: '0', point: { x: 0, y: 0 } },
      color: '#001',
      rotateAngle: 0,
    }

    render(element: RectangleElement) {
      return <div style={{ width: '100%', height: '100%', background: element.color }} />;
    }

    renderProperties(selectedElement: RectangleElement): JSX.Element {
      const dispatch = useDispatch();
      return (
        <div style={{ background: 'white', height: '100%' }}>
          <FormLabel component="legend">Rectangle Properties</FormLabel>

          <div className="Designer">
            <ColorPicker
              name="color"
              defaultValue="#000"
              value={selectedElement.color}
              onChange={(color) => dispatch(changeRectangleColor({ id: selectedElement.id, color }))}
            />
          </div>
        </div>
      );
    }
}

export default new Rectangle();

export const TextPropertyEditor: React.FC<{label: string; value: string; onChange: (value: string) => void}> = ({
  label,
  value,
  onChange,
}) => {
  const [pickerVisible, setPickerVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, () => setPickerVisible(false));
  const internalOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };
  return (
    <TextField
      multiline
      variant="outlined"
      label={capitalizeFirst(label)}
      value={value}
      onChange={internalOnChange}
    />
  );
};
