import { MENU_ITEMS } from '@/constants';
import { actionItemClick } from '@/slice/menuSlice';
import React, { useEffect, useLayoutEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';

function Board() {

    const dispatch = useDispatch();
    const canvasRef = useRef(null);
    const shouldDraw = useRef(false);
    const drawHistory = useRef([]);
    const historyPointer = useRef(0);
    const { activeMenuItem, actionMenuItem } = useSelector((state) => state.menu);
    const { color, size } = useSelector((state) => state.toolbox[activeMenuItem])

    useEffect(() => {
        if(!canvasRef.current) return;

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        if(actionMenuItem == MENU_ITEMS.DOWNLOAD) {
            const URL = canvas.toDataURL();
            const anchor = document.createElement('a');
            anchor.href = URL;
            anchor.download = 'sketch.jpg';
            anchor.click();
        } else if (actionMenuItem == MENU_ITEMS.UNDO) {
            if(historyPointer.current > 0) historyPointer.current -= 1;
            const imageData = drawHistory.current[historyPointer.current];
            context.putImageData(imageData, 0, 0);
        } else if (actionMenuItem == MENU_ITEMS.REDO) {
            if(historyPointer.current < drawHistory.current.length - 1) historyPointer.current += 1;
            const imageData = drawHistory.current[historyPointer.current];
            context.putImageData(imageData, 0, 0);
        }

        dispatch(actionItemClick(null));

    }, [actionMenuItem])
    
    useEffect(() => {
        if(!canvasRef.current) return;

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        const changeConfig = () => {
            context.strokeStyle = color;
            context.lineWidth = size;
        }

        changeConfig();

    }, [color, size])

    useLayoutEffect(() => {
        if(!canvasRef.current) return;

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const beginPath = (x, y) => {
            context.beginPath();
            context.moveTo(x, y);
        }

        const drawLine = (x, y) => {
            context.lineTo(x, y);
            context.stroke();
        }

        const handleMouseDown = (e) => {
            shouldDraw.current = true;
            beginPath(e.clientX, e.clientY);
        }
        
        const handleMouseMove = (e) => {
            if(!shouldDraw.current) return;
            drawLine(e.clientX, e.clientY);
        }
        
        const handleMouseUp = (e) => {
            shouldDraw.current = false;
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            drawHistory.current.push(imageData);
            historyPointer.current = drawHistory.current.length - 1;
        }

        canvas.addEventListener('mousedown', handleMouseDown);
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseup', handleMouseUp);

        return () => {
            canvas.removeEventListener('mousedown', handleMouseDown);
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mouseup', handleMouseUp);
        }

    }, [])

    return (
        <canvas ref={canvasRef}>

        </canvas>
    )
}

export default Board