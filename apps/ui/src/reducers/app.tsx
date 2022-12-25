import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Auth0Config} from "types";
import {getLink} from "../utils";

export type AppState = {
    auth0: Auth0Config | null,
    jwtToken: string | null,
    currentPath: string | null
}

const initialState = {currentPath: null, auth0: null, jwtToken: null} as AppState

export const getConfig = createAsyncThunk(
    'template/fetchConfig', async (thunkAPI) => {
        const data = await fetch(getLink("/api/config"), { method: 'GET', headers: {
                'Content-Type': 'application/json'
            } });

        return await data.json()
    }
);


export const login = createAsyncThunk(
    'user/login', async ({email, password}:{email:string, password:string}, thunkAPI) => {
        const data = await fetch(getLink("/api/browser/login"), { method: 'POST', 
        
        body: JSON.stringify({email, password}),
        headers: {
                'Content-Type': 'application/json'
            } });

        return await data.json()
    }
);


const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        navigateTo(state, action: PayloadAction<string>){
            state.currentPath = action.payload
        }
    },
    extraReducers: (builder)=>{
        builder.addCase(getConfig.fulfilled, (state, action) => {
            state.auth0 = action.payload;
        });
        builder.addCase(login.fulfilled, (state, action) => {
            state.jwtToken = action.payload.token
            if(state.jwtToken){
                state.currentPath = "/templates"
            }
        });
    }
})

export default appSlice.reducer;



export const {
    navigateTo
  } = appSlice.actions;
  