import React, {useEffect} from 'react';
import styled from 'styled-components';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { orange } from '@material-ui/core/colors';
import {Provider, useDispatch, useSelector} from 'react-redux';
import SplitPane from 'react-split-pane';
import { configureStore } from '@reduxjs/toolkit';
import Canvas from './Canvas';
import LeftSidebar from './LeftSidebar/LeftSidebar';
import RightSidebar from './RightSidebar/RightSidebar';
import { TopBanner } from './Banner';
import reducers, {RootState} from './reducers';
import { PDFViewer } from './PDFViewer';
import {getConfig} from "./reducers/app";
import {useHistory} from "react-router-dom";
import { loadTemplate } from './reducers/componentInteractions';
import { withAuthenticationRequired } from './ui/helpers';

const CanvasDiv = styled.div`
     width:100%;
     padding:0px;
     background:#f8f9fa;
     overflow:scroll;
     max-height:100vh;
     justify-content: center;
`;

export const Designer: React.FC = withAuthenticationRequired((props) => {
  console.log(props)
    const {templateId} = props.match.params
    const jwtToken = useSelector((state:RootState) => state.appSlice.jwtToken);
    const dispatch = useDispatch();
    const history = useHistory();


    useEffect(()=>{

      (async ()=>{
        dispatch(loadTemplate({templateId}))
      })()

    }, [templateId])

    if(!jwtToken){
        history.push("/login")
        return <div></div>
    }
  

  return <SplitPane defaultSize="12%" split="vertical">
      <div>
        <LeftSidebar/>
      </div>
      <div>
        <SplitPane defaultSize="50%" split="vertical">
          <CanvasDiv>
            <Canvas templateId = {templateId}/>
          </CanvasDiv>
          <div>
            <SplitPane defaultSize="55%" split="vertical">
              <div>
                <RightSidebar/>
              </div>

              <PDFViewer/>

            </SplitPane>

          </div>
        </SplitPane>
      </div>
    </SplitPane>
})

