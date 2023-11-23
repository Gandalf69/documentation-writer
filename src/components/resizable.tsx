import { useEffect, useState } from "react";
import { ResizableBox, ResizableBoxProps } from "react-resizable";
import './resizable.css';

interface ResizableProps {
    direction: "horizontal" | "vertical";
    children?: React.ReactNode;
  }

const Resizable: React.FC<ResizableProps> = ({direction, children}) => {
    const [innerHeight, setInnerHeight] = useState(window.innerHeight); 
    const [innerWidth, setInnerWidth] = useState(window.innerWidth); 
    const [width, setWidth] = useState(window.innerWidth * 0.75)

    let resizableProps: ResizableBoxProps;

    useEffect(() => {
        let timer: any;

        const listener = () => {
            if(timer) {
                clearTimeout(timer)
            }
            timer = setTimeout(() => {
                setInnerWidth(window.innerWidth)
                setInnerHeight(window.innerHeight)
                if(window.innerWidth * 0.75 < width) {
                    setWidth(window.innerWidth * 0.75)
                }
            }, 100)
        }

        window.addEventListener('resize', listener);

        return () => {
            window.removeEventListener('resize', listener);
        }
    }, []);

    useEffect(() => {
        const resizeErrorListener = (e: ErrorEvent) => {
        if (e.message ==="ResizeObserver loop completed with undelivered notifications.") {
                const resizeObserverErrDiv = document.getElementById("webpack-dev-server-client-overlay-div");
                const resizeObserverErr = document.getElementById("webpack-dev-server-client-overlay");
                if (resizeObserverErr) {
                    resizeObserverErr.setAttribute("style", "display: none");
                }
                if (resizeObserverErrDiv) {
                    resizeObserverErrDiv.setAttribute("style", "display: none");
                }
                }
        };
        window.addEventListener("error", resizeErrorListener);
    
        return () => window.removeEventListener("error", resizeErrorListener);
    }, []);

    if(direction === 'horizontal') {
        resizableProps = {
            className: 'resize-horizontal',
            height: Infinity,
            width: width,
            resizeHandles: ['e'],
            minConstraints: [innerWidth * 0.2, Infinity],
            maxConstraints: [innerWidth * 0.75, Infinity],
            onResizeStop: (event, data) => {
                setWidth(data.size.width)
            }
        }
    } else {
        resizableProps = {
            height: 300,
            width: Infinity,
            resizeHandles: ['s'],
            minConstraints: [Infinity, 24],
            maxConstraints: [Infinity, innerHeight * 0.9]
        }
    }

    return (
        <ResizableBox 
            {...resizableProps}
        >
            {children}
        </ResizableBox>
    )
}

export default Resizable;