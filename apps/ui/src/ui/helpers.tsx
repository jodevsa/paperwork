import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { RootState } from '../reducers';
import {  navigateTo } from '../reducers/app';

export const withAuthenticationRequired = (Component: any)=>{

    const NewComponent = (props)=>{
      const jwtToken = useSelector((state:RootState) => state.appSlice.jwtToken);

      const dispatch = useDispatch()
      if(!jwtToken){
        dispatch(navigateTo("/login"))
        return <></>
      }
     return <Component {...props} />
    }
    return NewComponent
  }