import React, { Component, PureComponent } from 'react';
import { getLength, getAngle, getCursor } from '../utils';
import StyledRect from './StyledRect';

const zoomableMap:any = {
  n: 't',
  s: 'b',
  e: 'r',
  w: 'l',
  ne: 'tr',
  nw: 'tl',
  se: 'br',
  sw: 'bl',
};

type Props = {
    isSelected?: boolean,
    onResizeStart?: ()=>void
    onResize?: (deltaL: number, alpha: number, rect: { width:number, height:number, centerX:number, centerY:number, rotateAngle:number }, type: string, isShiftKey:boolean)=> void
    onResizeEnd?: ()=>void,
    onRotateStart?: ()=>void,
    onRotate?: (angle:number, startAngle:number)=> void
    onRotateEnd?: ()=>void,
    onDragStart?: ()=>void,
    onDrag: (deltaX:number, deltaY:number)=>void,
    onDragEnd?: ()=>void,
    parentRotateAngle?: number,
    rotatable: boolean,
    zoomable: string,
    className?: string,
    styles?: any
}
export default class Rect extends React.Component<Props, {}> {
    // internal state ( react sate isn't used as these do not influence rendering)
    private _elementRef:any

    private _isMouseDown: boolean = false

    setElementRef = (ref:any) => { this._elementRef = ref; }

    // Drag
    startDrag = ({ clientX: startX, clientY: startY }: any) => {
      this.props.onDragStart && this.props.onDragStart();
      this._isMouseDown = true;
      const onMove = (e: MouseEvent) => {
        if (!this._isMouseDown) return; // patch: fix windows press win key during mouseup issue
        e.stopImmediatePropagation();
        const { clientX, clientY } = e;
        const deltaX = clientX - startX;
        const deltaY = clientY - startY;
        this.props.onDrag(deltaX, deltaY);
        startX = clientX;
        startY = clientY;
      };
      const onUp = () => {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
        if (!this._isMouseDown) return;
        this._isMouseDown = false;
        this.props.onDragEnd && this.props.onDragEnd();
      };
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    }

    // Rotate
    startRotate = (e:any) => {
      if (e.button !== 0) return;
      const { clientX, clientY } = e;
      const { styles: { transform: { rotateAngle: startAngle } } } = this.props;
      const rect = this._elementRef.getBoundingClientRect();
      const center = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
      const startVector = {
        x: clientX - center.x,
        y: clientY - center.y,
      };
      this.props.onRotateStart && this.props.onRotateStart();
      this._isMouseDown = true;
      const onMove = (e:MouseEvent) => {
        if (!this._isMouseDown) return; // patch: fix windows press win key during mouseup issue
        e.stopImmediatePropagation();
        const { clientX, clientY } = e;
        const rotateVector = {
          x: clientX - center.x,
          y: clientY - center.y,
        };
        const angle = getAngle(startVector, rotateVector);
        this.props && this.props.onRotate && this.props.onRotate(angle, startAngle);
      };
      const onUp = () => {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
        if (!this._isMouseDown) return;
        this._isMouseDown = false;
        this.props.onRotateEnd && this.props.onRotateEnd();
      };
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    }

    // Resize
    startResize = (e: any, cursor:any) => {
      if (e.button !== 0) return;
      document.body.style.cursor = cursor;
      const { styles: { position: { centerX, centerY }, size: { width, height }, transform: { rotateAngle } } } = this.props;
      const { clientX: startX, clientY: startY } = e;
      const rect = {
        width, height, centerX, centerY, rotateAngle,
      };
      const type = e.target.getAttribute('class').split(' ')[0];
      this.props.onResizeStart && this.props.onResizeStart();
      this._isMouseDown = true;
      const onMove = (e:MouseEvent) => {
        if (!this._isMouseDown) return; // patch: fix windows press win key during mouseup issue
        e.stopImmediatePropagation();
        const { clientX, clientY } = e;
        const deltaX = clientX - startX;
        const deltaY = clientY - startY;
        const alpha = Math.atan2(deltaY, deltaX);
        const deltaL = getLength(deltaX, deltaY);
        const isShiftKey = e.shiftKey;
        this.props && this.props.onResize && this.props.onResize(deltaL, alpha, rect, type, isShiftKey);
      };

      const onUp = () => {
        document.body.style.cursor = 'auto';
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
        if (!this._isMouseDown) return;
        this._isMouseDown = false;
        this.props.onResizeEnd && this.props.onResizeEnd();
      };
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    }

    render() {
      const {
        children,
        className,
        styles: {
          position: { centerX, centerY },
          size: { width, height },
          transform: { rotateAngle },
        },
        zoomable,
        rotatable,
        isSelected,
        parentRotateAngle,
      } = this.props;
      const style = {
        width: Math.abs(width),
        height: Math.abs(height),
        transform: `rotate(${rotateAngle}deg)`,
        left: centerX - Math.abs(width) / 2,
        top: centerY - Math.abs(height) / 2,
      };
      const direction = zoomable.split(',').map((d) => d.trim()).filter((d) => d); // TODO: may be speed up

      return (
        <StyledRect
          ref={this.setElementRef}
          onMouseDown={this.startDrag}
          className={`rect single-resizer ${className}`}
          style={{ ...style, boxSizing: 'border-box' }}
        >
          {
                    isSelected && rotatable
                    && (
                    <div className="rotate" onMouseDown={this.startRotate}>
                      <svg width="14" height="14" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M10.536 3.464A5 5 0 1 0 11 10l1.424 1.425a7 7 0 1 1-.475-9.374L13.659.34A.2.2 0 0 1 14 .483V5.5a.5.5 0 0 1-.5.5H8.483a.2.2 0 0 1-.142-.341l2.195-2.195z"
                          fill="#eb5648"
                          fillRule="nonzero"
                        />
                      </svg>
                    </div>
                    )
                }

          {
                    isSelected

                    && direction.map((d) => {
                      const cursor:string = `${getCursor(rotateAngle + parentRotateAngle, d)}-resize`;
                      return (
                        <div key={d} style={{ cursor }} className={`${zoomableMap[d]} resizable-handler`} onMouseDown={(e:any) => this.startResize(e, cursor)} />
                      );
                    })
                }

          {
                    isSelected
                    && direction.map((d) => (
                      <div key={d} className={`${zoomableMap[d]} square`} />
                    ))
                }
          {children}
        </StyledRect>
      );
    }
}
