import React, {useRef, useState,FunctionComponent} from 'react'
import styled from 'styled-components'

import _ from "underscore"



type Props = {
    disableMove?: boolean,
    initialZoom?: number
}

const Window = styled.div`
    flex: 1;
    position: relative;
    background:rgb(246,247,249);
    overflow:hidden;
    padding:2px;
    transform-origin: top left;
    height:100%;
`

const InsideWindow = styled.div`
    width:100%;
    height:100%;
    transform-origin: top left;
`


type State = {
    zoomLevel:number,
    translate:{x:number, y:number},
    lastOperation:number,
    mouseDownLocation?:{x:number, y:number} | null
}

type Point = {x:number, y:number}

export const ZoomableWindow: FunctionComponent<Props> = ({children, initialZoom= 1,disableMove = false}) => {
    const [state, setState] = useState<State>({lastOperation:1,zoomLevel:1,translate:{x:0,y:0}})
    const windowRef = useRef<HTMLDivElement>(null);
    function getCoordinateRelativeToPage(e:React.MouseEvent): Point{

        const x =(e.clientX - (windowRef?.current?.getBoundingClientRect()?.x ?? 0) - state.translate.x)/state.zoomLevel
        const y = (e.clientY - (windowRef?.current?.getBoundingClientRect()?.y ?? 0)  - state.translate.y) / state.zoomLevel

        return {x,y}
    }

   return  <Window
       id={"window"}
       onWheel={(e:React.WheelEvent)=>{
           if(windowRef.current == null){
               return;
           }
           let coordinate = getCoordinateRelativeToPage(e)


           const wheelDirection = e.deltaY < 0 ? 1 : -1;

           const newZoom = Math.min(2,Math.max(0.75,state.zoomLevel  + (wheelDirection * 0.2)))
           const xDiff = -(coordinate.x * (newZoom-1))
           const yDiff = -((coordinate.y) * (newZoom-1))

           setState({...state,lastOperation:Date.now(),zoomLevel:newZoom, translate:{x: xDiff,y:yDiff}})



       }}
       onMouseUp = {()=>{
           if(state.mouseDownLocation != null) {
               setState({...state, mouseDownLocation: null})
           }
       }}
       onMouseLeave = {()=>{
           if(state.mouseDownLocation != null) {
               setState({...state, mouseDownLocation: null})
           }
       }}
       onMouseDown ={(e)=> setState({...state,mouseDownLocation:getCoordinateRelativeToPage(e)})}
       ref ={windowRef}
       onMouseMove={(e)=>{
           if(state.mouseDownLocation == null || disableMove){
               return
           }
           const coordinate = getCoordinateRelativeToPage(e)
           setState({...state,lastOperation:Date.now(),translate:{x:state.translate.x + coordinate.x - state.mouseDownLocation?.x??0 ,y: state.translate.y + coordinate.y - state.mouseDownLocation?.y}})
       }}>

        <InsideWindow style={{transform:`translate(${state.translate.x}px,${state.translate.y}px) scale(${state.zoomLevel}) `}}>
            { children}
        </InsideWindow>

    </Window>


}