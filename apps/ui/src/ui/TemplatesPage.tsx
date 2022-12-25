import React, {useEffect} from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import styled from 'styled-components';
import clsx from 'clsx';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { makeStyles } from '@material-ui/core/styles';
import { createTemplate, retrieveTemplates } from '../reducers/TemplatesPageReducer';
import {Provider, useDispatch, useSelector} from 'react-redux';
import {useAuth0} from "@auth0/auth0-react";
import { RootState } from '../reducers';
import {  navigateTo } from '../reducers/app';
import { withAuthenticationRequired } from '@auth0/auth0-react';

const useStyles = makeStyles((theme) => ({
    root: {
      maxWidth: 345,
      margin: "5px"
    },
    media: {
      height: 0,
      paddingTop: '56.25%', // 16:9
    },
    expand: {
      transform: 'rotate(0deg)',
      marginLeft: 'auto',
      transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
      }),
    },
    expandOpen: {
      transform: 'rotate(180deg)',
    },
    avatar: {
      backgroundColor: red[500],
    },
  }));
  
  const TemplatesContainer = styled.div`
     display: flex;
     flex-wrap: wrap;
     justify-content: center;
`;


  export default function TemplateCard({templateId, title, previewUrl}:{templateId: string, title: string, previewUrl:string}) {
    const classes = useStyles();
    const dispatch = useDispatch()
    const [expanded, setExpanded] = React.useState(false);
  
    const handleExpandClick = () => {
      setExpanded(!expanded);
    };
  
    return (
      <Card className={classes.root} onClick={()=>{
          dispatch(navigateTo(`/edit/${templateId}`))

      }}>
        <CardHeader
          action={
            <IconButton aria-label="settings">
              <MoreVertIcon />
            </IconButton>
          }
          title={title}
          subheader="September 14, 2016"
        />
        <CardMedia
          className={classes.media}
          image={previewUrl}
          title="Paella dish"
        />
        <CardContent>

        </CardContent>


      </Card>
    );
  }
export const TemplatesPage  = withAuthenticationRequired(() => {
  
  const dispatch = useDispatch()
    const classes = useStyles();
    const templates = useSelector((state:RootState) => state.templatesPageSlice.templates || []);
    useEffect(()=>{

      ( async ()=>{
      dispatch(retrieveTemplates())

      })()

    },[])

    return  <>
            <h2> Templates </h2>
            <button onClick={async ()=>{
                dispatch(createTemplate())

            }}> click </button>
    <TemplatesContainer>
      {templates.map(template=>
        <TemplateCard templateId = {template.templateId} title="wtf" previewUrl="https://www.vtexperts.com/wp-content/uploads/2016/02/VTiger-Professional-PDF-Template-Cyan2.png"/>
        )}


 
    </TemplatesContainer>
    </>
})


