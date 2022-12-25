import {$CombinedState, combineReducers} from 'redux'
import templateSlice from './componentInteractions'
import appSlice from "./app";

import templatesPageSlice from "./TemplatesPageReducer";

const rootReducer = combineReducers({
    templateSlice, appSlice, templatesPageSlice
})


export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>