import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Auth0Config} from "types";
import {getLink} from "../utils";

export type AppState = {
    accessToken: string | null,
    auth0: Auth0Config | null,
    currentPath: string | null
}

const initialState = {currentPath: null, auth0: null} as AppState

export const getConfig = createAsyncThunk(
    'template/fetchConfig', async (thunkAPI) => {
        const data = await fetch(getLink("/api/config"), { method: 'GET', headers: {
                'Content-Type': 'application/json'
            } });

        return await data.json()
    }
);


const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        updateAccessToken(state, action: PayloadAction<string>){
            state.accessToken = action.payload
        },
        navigateTo(state, action: PayloadAction<string>){
            state.currentPath = action.payload
        }
    },
    extraReducers: (builder)=>{
        builder.addCase(getConfig.fulfilled, (state, action) => {
            state.auth0 = action.payload;
        });
    }
})

export default appSlice.reducer;



export const {
    navigateTo,
    updateAccessToken
  } = appSlice.actions;
  