import React, { createContext } from "react";
import { useState, useContext } from "react";

// TODO make a context

export const Surface = createContext({});

export const Draggable: React.FC = (props) => {
  const [dragging, setDragging] = useState(false);
  const [start, setStart] = useState([0, 0]);
  const [d, setd] = useState([0, 0]);

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setDragging(true);
    setStart([e.clientX, e.clientY])
  };

  const onDrag = (e: React.MouseEvent) => {
    if (!dragging) {
      return;
    }

    e.preventDefault();
    const [startX, startY] = start;
    const [dx, dy] = d;
    setd([(startX - e.clientX) - dx, (startY - e.clientY) - dy]);
  };

  const onMouseUp = () => {
    setDragging(false);
    setStart([0, 0])
  };

  const [dx, dy] = d;
  return (
    <div
      onMouseDown={onMouseDown}
      onMouseMove={onDrag}
      onMouseUp={onMouseUp}
      style={{ transform: `translate(${dx}px, ${dy}px)` }}
    >
      {props.children}
    </div>
  )
};
