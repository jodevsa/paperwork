import React, { Component, PureComponent } from 'react';
import Rect from './Rectangle';
import {
  centerToTL, tLToCenter, getNewStyle, degToRadian,
} from './utils';

type RectProps = {
    width:number, height:number, top:number, left:number, rotateAngle:number
}
type Props = {
    isSelected?:boolean,
    className?: string,
    left: number,
    top: number,
    width: number,
    height:number,
    rotatable: boolean,
    rotateAngle: number,
    parentRotateAngle: number,
    lockAspectRatio: boolean,
    zoomable: string,
    minWidth: number,
    minHeight: number,
    onRotateStart?: ()=>void
    onRotate: (rotateAngle:number) => void,
    onRotateEnd?: ()=>void,
    onResizeStart?: ()=>void,
    onResize: (rectProps:RectProps, isShiftKey: boolean, type:string)=>void,
    onResizeEnd?: ()=>void,
    onDragStart?: ()=>void,
    onDrag: (deltaX:number, deltaY:number)=>void,
    onDragEnd?: ()=>void,
}
/*
onDragEnd={} onDragStart={} onResizeEnd={} onResizeStart={} onRotateEnd={} onRotateStart={}
 */
export default class ResizableRect extends React.Component<Props, {}> {
    static defaultProps = {
      parentRotateAngle: 0,
      rotateAngle: 0,
      rotatable: true,
      zoomable: '',
      minWidth: 10,
      minHeight: 10,
    }

    handleRotate = (angle:number, startAngle: number) => {
      if (!this.props.onRotate) return;
      let rotateAngle = Math.round(startAngle + angle);
      if (rotateAngle >= 360) {
        rotateAngle -= 360;
      } else if (rotateAngle < 0) {
        rotateAngle += 360;
      }
      if (rotateAngle > 356 || rotateAngle < 4) {
        rotateAngle = 0;
      } else if (rotateAngle > 86 && rotateAngle < 94) {
        rotateAngle = 90;
      } else if (rotateAngle > 176 && rotateAngle < 184) {
        rotateAngle = 180;
      } else if (rotateAngle > 266 && rotateAngle < 274) {
        rotateAngle = 270;
      }
      this.props.onRotate(rotateAngle);
    }

    handleResize = (length:number, alpha:number, rect:any, type:string, isShiftKey:boolean) => {
      if (!this.props.onResize) return;
      const {
        rotateAngle, lockAspectRatio, minWidth, minHeight, parentRotateAngle,
      } = this.props;
      const beta = alpha - degToRadian(rotateAngle + parentRotateAngle);
      const deltaW = length * Math.cos(beta);
      const deltaH = length * Math.sin(beta);
      const ratio = isShiftKey && !lockAspectRatio ? rect.width / rect.height : lockAspectRatio;
      const {
        position: { centerX, centerY },
        size: { width, height },
      } = getNewStyle(type, { ...rect, rotateAngle }, deltaW, deltaH, ratio, minWidth, minHeight);

      this.props.onResize(centerToTL({
        centerX, centerY, width, height, rotateAngle,
      }), isShiftKey, type);
    }

    handleDrag = (deltaX:number, deltaY:number) => {
      this.props.onDrag && this.props.onDrag(deltaX, deltaY);
    }

    render() {
      const {
        isSelected,
        children, className, top, left, width, height, rotateAngle, parentRotateAngle, zoomable, rotatable,
        onRotate, onResizeStart, onResizeEnd, onRotateStart, onRotateEnd, onDragStart, onDragEnd,
      } = this.props;

      const styles = tLToCenter({
        top, left, width, height, rotateAngle,
      });

      return (
        <Rect
          isSelected={isSelected}
          children={children}
          className={className}
          styles={styles}
          zoomable={zoomable}
          rotatable={Boolean(rotatable && onRotate)}
          parentRotateAngle={parentRotateAngle}

          onResizeStart={onResizeStart}
          onResize={this.handleResize}
          onResizeEnd={onResizeEnd}

          onRotateStart={onRotateStart}
          onRotate={this.handleRotate}
          onRotateEnd={onRotateEnd}

          onDragStart={onDragStart}
          onDrag={this.handleDrag}
          onDragEnd={onDragEnd}
        />
      );
    }
}
