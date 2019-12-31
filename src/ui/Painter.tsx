import React, { useState, Dispatch } from "react";
import CSS from "csstype";
import { connect } from "react-redux";
import { AppState, State, Coordinate, Link, PaintState } from "../state/model";
import { getSmallCoordinatesFromXY, toCoordinates } from "./size/sizer";
import { Actions } from "../state/cellActions";
import { SEND_COORDINATE } from "../state/actionTypes";
import { start } from "repl";
import { Z_STREAM_END } from "zlib";

const defaultStyle: CSS.Properties = {
  position: "absolute",
  zIndex: 2
};

export type PaintProps = {
  size: number;
  painting: boolean;
  lines: Array<Link>;
  underway: Coordinate | null;
  sendPaint: (c: Coordinate) => void;
};

type PointerState = {
  x2: number;
  y2: number;
};

const snapTo = (size: number, x: number, y: number) => {
  // snap to the closest
  let spacing = size / (9 * 3);
  let snap = spacing;

  const x1 = Math.round((x - spacing * 0.5) / snap) * snap + spacing * 0.5;
  const y1 = Math.round((y - spacing * 0.5) / snap) * snap + spacing * 0.5;

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
  setState({
    ...state,
    x2: x,
    y2: y
  });
};

const onClick = (
  e: React.MouseEvent,
  state: PointerState,
  size: number,
  send: (c: Coordinate) => void,
  setState: (p: PointerState) => void
) => {
  const coords = getSmallCoordinatesFromXY(size, state.x2, state.y2);
  send(coords);
  setState({x2: -1, y2: -1})
};

export const PaintUI = (props: PaintProps) => {
  const { sendPaint, underway, size } = props;
  let style: CSS.Properties = {
    ...defaultStyle
  };
  let [x, y] = [-1, -1];
  let def = { x2: x, y2: y };
  const [state, setState] = useState(def);

  if (!props.painting || underway == null) {
    style.pointerEvents = "none";
  } else {
    let [x,y] = toCoordinates(size, underway)
    style.pointerEvents = "all";
    if(state.x2 < 0) {
      setState({x2: x, y2: y})
    }
  }

  let inProg = <></>;

  if (props.painting && underway) {
    [x, y] = toCoordinates(size, underway);
    inProg = (
      <line
        x1={x}
        y1={y}
        x2={state.x2}
        y2={state.y2}
        style={{ stroke: "rgb(255,0,0)", pointerEvents: "none" }}
      />
    );
  }

  let seen: Set<Coordinate> = new Set()
  const rest = props.lines.map((x, n) => {
    const seenStart = seen.has(x.start)
    const seenEnd = seen.has(x.end)
    seen.add(x.start)
    seen.add(x.end)
    const startCoords = toCoordinates(props.size, x.start);
    const endCoords = toCoordinates(props.size, x.end);
    const boxSize = (size / 9 / 4)
    const centerStartX = startCoords[0]  - boxSize / 2
    const centerStartY = startCoords[1]  - boxSize / 2
    const centerEndX = endCoords[0]  - boxSize / 2
    const centerEndY = endCoords[1] - boxSize / 2;
    const startNode = seenStart ? null : (
      <rect
        x={centerStartX}
        y={centerStartY}
        width={boxSize * 0.8}
        height={boxSize * 0.9}
        fill="rgba(174, 214, 157, 0.2)"
        style={{ pointerEvents: "none" }}
      />
    );
    const endNode = seenEnd ? null : (
      <rect
        x={centerEndX}
        y={centerEndY}
        width={boxSize * 0.8}
        height={boxSize * 0.9}
        fill="rgba(245, 240, 129, 0.2)"
        style={{ pointerEvents: "none" }}
      />
    );

    return (
      <g>
      <path
        d={`M ${startCoords[0]} ${startCoords[1]} L ${Math.round(endCoords[0])} ${Math.round(endCoords[1])}`}
        fill="transparent"
        stroke="#0000ffaa"
        style={{ pointerEvents: "none" }}
      />
      {startNode}{endNode}
      </g>
    );
  });

  return (
    <svg
      width={props.size}
      height={props.size}
      style={style}
      onMouseMove={e => onMouse(e, state, props.size, setState)}
      onClick={e => onClick(e, state, props.size, sendPaint, setState)}
    >
      {inProg}
      {rest}
    </svg>
  );
};

const mapStateToProps = (state: AppState) => {
  return {
    size: state.settings.boardSize,
    painting: state.settings.state === State.PAINTING
  };
};

const mapDispatchToProps = (dispatch: Dispatch<Actions>) => ({
  sendPaint: (c: Coordinate) =>
    dispatch({
      type: SEND_COORDINATE,
      coordinate: c
    })
});

export const Paint = connect(mapStateToProps, mapDispatchToProps)(PaintUI);
