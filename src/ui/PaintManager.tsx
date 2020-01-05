import React from "react";
import { Paint } from "./paint/Painter";
import { connect } from "react-redux";
import { AppState, State } from "../state/model";

export type Paint = {
  cell: number;
  subcell: number;
  color_start: string;
  color_end: string;
  color_line: string;
};

export type PaintManagerProps = {
  size: number;
  enabled: boolean;
};

export const PaintManager = (props: PaintManagerProps) => {
  const { enabled } = props;
  if (!enabled) {
    return <></>;
  }
  const painter = <Paint />;
  return <div>{painter}</div>;
};

const mapStateToProps = (state: AppState) => ({
  enabled: state.settings.state === State.PAINTING,
  size: state.settings.boardSize
});

export const ConnectedPainter = connect(mapStateToProps)(PaintManager);
