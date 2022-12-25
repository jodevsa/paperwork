import {Provider, useDispatch, useSelector} from "react-redux";
import {createMuiTheme, ThemeProvider} from "@material-ui/core/styles";
import React, {useEffect} from "react";
import {configureStore} from "@reduxjs/toolkit";
import reducers, {RootState} from "../reducers";
import Routes from "../Routes";
import {getConfig} from "../reducers/app";

import {red} from "@material-ui/core/colors";
import {useHistory} from "react-router-dom";

import {Redirect} from "react-router-dom"
import Spinner from "../Spinner";

const store = configureStore({
        reducer: reducers,
    },
    /* eslint-disable */
    // @ts-ignore
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
/* eslint-enable */




const outerTheme = createMuiTheme({
    palette: {
        primary: { main: "#263238" },
        secondary: {
            main: red[500],
        },
    }
})



const Root = () => (
    <Provider store={store}>
        <App/>
    </Provider>
);



const App = ()=>{
    const appState = useSelector((state:RootState) => state.appSlice);
    const dispatch = useDispatch();
    const history = useHistory();

      
    useEffect(()=>{
        dispatch(getConfig())
    },[!!appState])
    /*
    if(!appState?.auth0){
        return <Spinner/>
    }
    */


    return <ThemeProvider theme={outerTheme}>
        <Routes />
        </ThemeProvider>
}

export default Root;