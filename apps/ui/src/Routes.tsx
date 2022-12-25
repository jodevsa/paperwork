import React,{useEffect} from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
} from "react-router-dom";
import {Designer} from "./Designer";
import {TopBanner} from "./Banner";
import styled from "styled-components";
import { TemplatesPage } from "./ui/TemplatesPage";
import {Provider,useDispatch, useSelector} from 'react-redux';
import { navigateTo, updateAccessToken } from "./reducers/app";
import { RootState } from "./reducers";
import { resetTemplatePage } from "./reducers/componentInteractions";
import {useHistory} from "react-router-dom";
import { resetTemplatesPage } from "./reducers/TemplatesPageReducer";

import Loader from "react-loader-spinner";
import Spinner from "./Spinner";
import { LoginPage } from "./ui/LoginPage";

const AppContainer = styled.div`
        width: 100vw;
        height: 100vh;
`;


const Navigate = ()=>{

    const history = useHistory();
    const dispatch = useDispatch()
    const currentPath = useSelector((state:RootState) => state.appSlice).currentPath;


    useEffect(()=>{
        if(currentPath !== history.location.pathname){
            dispatch(navigateTo(history.location.pathname))
            }

        return history.listen((location)=>{
            if(currentPath !== location.pathname){
                dispatch(navigateTo(history.location.pathname))
                }

        });
    }, [])


    if(currentPath && currentPath!== history.location.pathname){
        return <Redirect to={currentPath} push/>
    }

    return <></>
}

const Routes =  ()=>{
    const dispatch = useDispatch()
    const history = useHistory();

    const jwtToken = useSelector((state:RootState) => state.appSlice.jwtToken);



    return <>
        <AppContainer>
        <TopBanner/>
        <Router>
        <Navigate/>
        <Switch>

        <Route path="/login" render={()=>{


return  <LoginPage/>
}}/>

        <Route path="/templates" render={()=>{

            dispatch(resetTemplatePage())
            return  <TemplatesPage/>
        }}/>
           
          

        <Route path="/edit/:templateId" 
        render= {(props)=>{
            
            dispatch(resetTemplatesPage())

            return <Designer {...props}/>

        }}/>
        
        <Route path="/"
        render={()=>{
            dispatch(resetTemplatePage())
            dispatch(resetTemplatesPage())


            return <div>

            <p> main page</p>
        </div>
        }}/>
        
    </Switch>
    </Router>
    </AppContainer>

    </>

}

export default Routes

