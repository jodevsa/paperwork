import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { RootState } from '../reducers';
import {  navigateTo } from '../reducers/app';

export const withAuthenticationRequired = (Component: any)=>{

    const NewComponent = ()=>{
      const jwtToken = useSelector((state:RootState) => state.appSlice.jwtToken);
      console.log(jwtToken)
      const dispatch = useDispatch()
      if(!jwtToken){
        dispatch(navigateTo("/login"))
        return <></>
      }
     return <Component/>
    }
    return NewComponent
  }