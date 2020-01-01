import React, { useState, Dispatch } from "react";
import CSS from "csstype";
import { connect } from "react-redux";
import {
  AppState,
  State,
  Coordinate,
  Link,
  CellState
} from "../../state/model";
import {
  getSmallCoordinatesFromXY,
  toCoordinates,
  snapTo
} from "../size/sizer";
import { Actions } from "../../state/cellActions";
import { SEND_COORDINATE } from "../../state/actionTypes";
import { Line } from "./Line";

const defaultStyle: CSS.Properties = {
  position: "absolute",
  zIndex: 2
};

const lineStyle: CSS.Properties = {
  pointerEvents: "none",
  stroke: "green"
};

export type PaintProps = {
  size: number;
  board: Array<CellState>;
  sendPaint: (c: Coordinate) => void;
};

type PointerState = {
  x2: number;
  y2: number;
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
  setState({ x2: -1, y2: -1 });
};

type LineCoordinates = {
  start: Coordinate;
  end: Coordinate;
};
type OngoingLine = {
  start: Coordinate;
  x: number;
  y: number;
} | null;

export const PaintUI = (props: PaintProps) => {
  const { sendPaint, size } = props;

  const [lineState, setLineState] = useState<Array<LineCoordinates>>([
    {
      start: {
        cell: 1,
        subcell: 2
      },
      end: {
        cell: 3,
        subcell: 8
      }
    }
  ]);
  const [ongoingLine, setOngoingLine] = useState<OngoingLine>(null);
  // if (!props.painting || underway == null) {
  //   style.pointerEvents = "none";
  // } else {
  //   let [x, y] = toCoordinates(size, underway);
  //   style.pointerEvents = "all";
  //   if (state.x2 < 0) {
  //     setState({ x2: x, y2: y });
  //   }
  // }

  let inProg = <></>;

  // if (props.painting && underway) {
  //   [x, y] = toCoordinates(size, underway);
  //   inProg = (
  //     <line
  //       x1={x}
  //       y1={y}
  //       x2={state.x2}
  //       y2={state.y2}
  //       style={{ stroke: "rgb(255,0,0)", pointerEvents: "none" }}
  //     />
  //   );
  // }
  const lines = lineState.map(x => (
    <Line seen={new Set()} size={size} start={x.start} end={x.end} />
  ));
  let ongoing = <></>;
  if (ongoingLine) {
    const [x, y] = toCoordinates(size, ongoingLine.start);
    ongoing = (
      <path
        d={`M ${x} ${y} L ${ongoingLine.x} ${ongoingLine.y}`}
        style={lineStyle}
      />
    );
  }

  return (
    <svg
      width={props.size}
      height={props.size}
      style={defaultStyle}
      onClick={onSvgClick(
        size,
        props.board,
        setLineState,
        setOngoingLine,
        lineState,
        ongoingLine
      )}
      onMouseMove={onMove(size, setOngoingLine, ongoingLine)}
      // onMouseMove={e => onMouse(e, state, props.size, setState)}
      // onClick={e => onClick(e, state, props.size, sendPaint, setState)}
    >
      {inProg}
      {lines}
      {ongoing}
    </svg>
  );
};

type SvgClick = React.MouseEvent<SVGElement>;
type StateDispatch<T> = Dispatch<React.SetStateAction<T>>;

const onMove = (
  size: number,
  setOngoingLine: StateDispatch<OngoingLine>,
  ongoingLine: OngoingLine
) => (e: SvgClick) => {
  if (!(e.target instanceof SVGElement)) {
    return;
  }
  if (ongoingLine?.start) {
    const rect = e.target.getBoundingClientRect();
    const [x, y] = snapTo(size, e.clientX - rect.left, e.clientY - rect.top);
    setOngoingLine({
      ...ongoingLine,
      x,
      y
    });
  }
};

const onSvgClick = (
  size: number,
  board: Array<CellState>,
  setLineState: StateDispatch<Array<Link>>,
  setOngoingLine: StateDispatch<OngoingLine>,
  lineState: Array<Link>,
  ongoingLine: OngoingLine
) => (e: SvgClick) => {
  if (ongoingLine == null) {
    return startLine(size, e, ongoingLine, setOngoingLine, board);
  }
};

const startLine = (
  size: number,
  e: SvgClick,
  line: OngoingLine,
  setLine: StateDispatch<OngoingLine>,
  board: Array<CellState>
) => {
  if (!(e.target instanceof SVGElement)) {
    return;
  }
  const target = e.target;
  const rect = target.getBoundingClientRect();
  const [x, y] = snapTo(size, e.clientX - rect.left, e.clientY - rect.top);
  const coord = getSmallCoordinatesFromXY(size, x, y);
  const small = board[coord.cell].small;
  const correctClick = small.indexOf(coord.subcell + 1) !== -1;
  if (correctClick) {
    setLine({
      start: coord,
      x: x,
      y: y
    });
  }
};

const mapStateToProps = (state: AppState) => {
  return {
    size: state.settings.boardSize,
    board: state.cells
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
