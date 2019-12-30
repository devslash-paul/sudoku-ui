import React, { useState } from "react";
import CSS from "csstype";
import { connect } from "react-redux";
import { AppState, State } from "../state/model";

const defaultStyle: CSS.Properties = {
  position: "absolute",
  zIndex: 1
};

export type PaintProps = {
  size: number;
  painting: boolean;
};

type PointerState = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  at: "START" | "END";
};

const snapTo = (size: number, x: number, y: number) => {
  // snap to the closest
  let spacing = size / (9 * 3);
  let snap = spacing

  const x1= Math.round((x-spacing*0.5) / snap) * snap + spacing * 0.5;
  const y1= Math.round((y-spacing * 0.5) / snap) * snap + spacing * 0.5;

  return [x1, y1];
};

const onMouse = (
  e: React.MouseEvent<SVGElement>,
  state: PointerState,
  size: number,
  setState: React.Dispatch<React.SetStateAction<PointerState>>
) => {
  if (!(e.target instanceof SVGElement)) {
    return;
  }
  const target = e.target;
  const rect = target.getBoundingClientRect();

  const [x, y] = snapTo(size, e.clientX - rect.left, e.clientY - rect.top);
  if (state.at === "START") {
    setState({
      ...state,
      x1: x,
      y1: y
    });
  } else {
    setState({
      ...state,
      x2: x,
      y2: y
    });
  }
};

const onClick = (
  e: React.MouseEvent,
  state: PointerState,
  setState: React.Dispatch<React.SetStateAction<PointerState>>
) => {
  if (state.at === "START") {
    state.at = "END";
  }
};

const createGrid = (size: number) => {
  const rows = [];
  const cols = [];
  let spacing = size / (9 * 3);
  for (let i = 0; i < 9 * 3; i++) {
    rows.push(
      <line
        x1={0}
        y1={i * spacing}
        x2={size}
        y2={i * spacing}
        style={{ stroke: "green", pointerEvents: 'none' }}
      />
    );
    cols.push(
      <line
        y1={0}
        x1={i * spacing}
        y2={size}
        x2={i * spacing}
        style={{ stroke: "green", pointerEvents:'none' }}
      />
    );
  }

  return (
    <g>
      {rows}
      {cols}
    </g>
  );
};

export const PaintUI = (props: PaintProps) => {
  let style: CSS.Properties = {
    ...defaultStyle
  };
  if (!props.painting) {
    style.pointerEvents = "none";
  }

  const def: PointerState = {
    x1: 0,
    x2: 0,
    y1: 0,
    y2: 0,
    at: "START"
  };
  const [state, setState] = useState(def);
  const grid = createGrid(props.size);

  return (
    <svg
      width={props.size}
      height={props.size}
      style={style}
      onMouseMove={e => onMouse(e, state, props.size, setState)}
      onClick={e => onClick(e, state, setState)}
    >
      {grid}
      <line
        x1={state.x1}
        y1={state.y1}
        x2={state.x2}
        y2={state.y2}
        style={{ stroke: "rgb(255,0,0)", pointerEvents: "none" }}
      />
    </svg>
  );
};

const mapStateToProps = (state: AppState) => {
  return {
    size: state.settings.boardSize,
    painting: state.settings.state === State.PAINTING
  };
};

export const Paint = connect(mapStateToProps)(PaintUI);
