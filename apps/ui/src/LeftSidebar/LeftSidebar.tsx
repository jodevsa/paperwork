import React from 'react';
import {ListItem, makeStyles, Theme} from '@material-ui/core';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { useDispatch } from 'react-redux';
import { nanoid } from 'nanoid';
import { capitalizeFirst } from '../utils';
import { addElement } from '../reducers/componentInteractions';

import components, { getDesignerComponent } from '../DesignerComponents/components';
import { Sidebar } from '../ui/Sidebar';


const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.primary.main
  }
}));

export default () => {
  const dispatch = useDispatch();
  return (
    <Sidebar>
      {components.map((it) => (
        <ListItem
          key={it.type}
          onClick={() => {
            const designerComponent = getDesignerComponent(it.type);
            if (designerComponent) {
              dispatch(addElement({ ...designerComponent.defaultElement, id: nanoid() }));
            }
          }}
          button
        >
          <ListItemIcon>
            <it.icon />
          </ListItemIcon>
          <ListItemText primary={capitalizeFirst(it.type)} />
        </ListItem>
      ))}
    </Sidebar>
  );
};
