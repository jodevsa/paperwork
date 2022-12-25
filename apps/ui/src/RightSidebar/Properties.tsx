import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { select } from 'underscore';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  FormControl, FormLabel, InputLabel, OutlinedInput, TextField,
} from '@material-ui/core';

import LockIcon from '@material-ui/icons/Lock';
import DeleteIcon from '@material-ui/icons/Delete';
import { SidebarSection } from '../ui/Sidebar';
import { RefreshButton } from './RefreshButton';
import { getDesignerComponent } from '../DesignerComponents/components';
import { getSelectedElement } from '../selectors';
import { RootState } from '../reducers';
import {
  resizeElement, rotateElement, deleteElement, lockElement,
} from '../reducers/componentInteractions';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiFormLabel-root': {
      margin: theme.spacing(1),
    },
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
}));

const Properties: React.FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const selectedElement = useSelector((state: RootState) => getSelectedElement(state.templateSlice));
  if (!selectedElement) return null;
  const { id, width, height } = selectedElement;
  const left = selectedElement.location.point.x;
  const top = selectedElement.location.point.y;
  const componentSettings = getDesignerComponent(selectedElement.type);

  return (
    <div>
      <form className={classes.root} noValidate autoComplete="off">
        <div style={{ background: 'white', height: '100%' }}>
          <FormLabel component="legend">Basic Properties</FormLabel>
          <TextField
            type="number"
            label="Width"
            variant="outlined"
            value={width}
            onChange={(e) => {
              dispatch(resizeElement({
                id, width: Number(e.target.value), top, left, height,
              }));
            }}
          />

          <TextField
            type="number"
            label="Height"
            variant="outlined"
            value={height}
            onChange={(e) => {
              dispatch(resizeElement({
                id, height: Number(e.target.value), top, left, width,
              }));
            }}
          />

          <TextField
            type="number"
            label="Top"
            variant="outlined"
            value={top}
            onChange={(e) => {
              dispatch(resizeElement({
                id, top: Number(e.target.value), height, left, width,
              }));
            }}
          />

          <TextField
            type="number"
            label="Left"
            variant="outlined"
            value={left}
            onChange={(e) => {
              dispatch(resizeElement({
                id, left: Number(e.target.value), height, top, width,
              }));
            }}
          />

          <TextField
            type="number"
            label="Angle"
            variant="outlined"
            value={selectedElement.rotateAngle}
            onChange={(e) => {
              dispatch(rotateElement({ id, rotateAngle: Number(e.target.value) }));
            }}
          />
        </div>

        {
                        // @ts-ignore
                        componentSettings?.renderProperties(selectedElement)

                 }

        <Button
          onClick={(e) => {
            e.preventDefault();
            dispatch(deleteElement(id));
          }}
          variant="contained"
          color="secondary"
          startIcon={<DeleteIcon />}
        >
          Delete
        </Button>

        <Button
          onClick={(e) => {
            e.preventDefault();
            dispatch(lockElement(id));
          }}
          variant="contained"
          color="secondary"
          startIcon={<LockIcon />}
        >
          Lock
        </Button>

      </form>
    </div>
  );
};

export default Properties;
