import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import PDFTemplate, {Auth0Config} from "types";
import {getLink} from "../utils";
import { browserHistory } from "react-router-dom"
import { navigateTo } from "./app";


export type TemplatesPageState = {
    templates: PDFTemplate[],
    loading: boolean
}


export const retrieveTemplates = createAsyncThunk(
    'TemplatesPageReducer/retrieveTemplates', async (_, thunkAPI) => {
        console.log("woot..")

        const token = thunkAPI.getState().appSlice.accessToken
        const data = await fetch(getLink("/api/templates"), { method: 'GET',
        headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            } });

        const templates = await data.json();

        return templates
    }
);


const initialState = {templates: [], loading: false}

const slice = createSlice({
    name: 'TemplatesPageReducer',
    initialState,
    reducers: {
        resetTemplatesPage: (state)=>{
            state.loading = false;
            state.templates = []
        }
    },
    extraReducers: (builder)=> {
        builder.addCase(retrieveTemplates.fulfilled, (state, action)=>{
            const templates = action.payload
            state.templates = templates;

        })

    }
})

export default slice.reducer;


export const {resetTemplatesPage} = slice.actions

export const createTemplate = createAsyncThunk(
    'TemplatesPageReducer/createTemplate', async (_, thunkAPI) => {

        const token = thunkAPI.getState().appSlice.accessToken
        const data = await fetch(getLink("/api/template/create"), { method: 'POST',
        
        body: JSON.stringify({}),
        headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            } });

        const {templateId} = await data.json();
        thunkAPI.dispatch(navigateTo(`/edit/${templateId}`))

        return templateId
    }
);