import React, { useState, Dispatch } from "react";
import CSS from "csstype";
import { connect } from "react-redux";
import { AppState, Coordinate, Link, CellState } from "../../state/model";
import {
  getSmallCoordinatesFromXY,
  toCoordinates,
  snapTo
} from "../size/sizer";
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
  const { size } = props;

  const [lineState, setLineState] = useState<Array<LineCoordinates>>([]);
  const [ongoingLine, setOngoingLine] = useState<OngoingLine>(null);

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
    >
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
    return startLine(size, e, setOngoingLine, board);
  } else {
    // then we're looking for a second click
    return commitLine(
      size,
      e,
      ongoingLine,
      lineState,
      setOngoingLine,
      setLineState,
      board
    );
  }
};

const commitLine = (
  size: number,
  e: SvgClick,
  line: OngoingLine,
  lines: Array<Link>,
  setLine: StateDispatch<OngoingLine>,
  setLines: StateDispatch<Array<Link>>,
  board: Array<CellState>
) => {
  if (!(e.target instanceof SVGElement)) {
    return;
  }

  const target = e.target;
  const rect = target.getBoundingClientRect();
  const [x, y] = snapTo(size, e.clientX - rect.left, e.clientY - rect.top);
  const coord: Coordinate = getSmallCoordinatesFromXY(size, x, y);
  const small = board[coord.cell].small;
  const correctClick = small.indexOf(coord.subcell + 1) !== -1;
  if (correctClick && line !== null) {
    // commit the click and reset the line
    const next: Link = {
      start: line.start,
      end: coord
    };
    setLines([...lines, next]);
    setLine(null);
  }
};

const startLine = (
  size: number,
  e: SvgClick,
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

export const Paint = connect(mapStateToProps)(PaintUI);
