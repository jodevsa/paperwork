import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import { List } from '@material-ui/core';
import { InputGroup } from './Input';
import { Title } from './Typography';
import { colors } from './constants';

export const Sidebar: FunctionComponent<{}> = (props) => <List component="nav">{props.children}</List>;

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
}));

export const SidebarSection: React.FC<{title: string}> = ({ title, children }) => {
  const classes = useStyles();

  return (
    <form className={classes.root} noValidate autoComplete="off">
      <div>{children}</div>
    </form>
  );
};
