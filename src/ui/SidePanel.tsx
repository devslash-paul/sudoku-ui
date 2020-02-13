import React, { Dispatch } from "react";
import LayersClearIcon from '@material-ui/icons/LayersClear';
import { connect } from "react-redux";
import { AppState, CellState } from "../state/model";
import Button from "@material-ui/core/Button";
import {
  clearEvents
} from "../state/sidebarActions";
import { Actions } from "../state/cellActions";
import { BoardUI } from "./Board";
import { History } from './History';
import { ConnectedControls } from "./sidebar/Controls";

type SidebarProps = {
  board: string;
  boardCells: Array<CellState>;

  clearHistory: () => void;
};


const Sidebar = (props: SidebarProps) => {
  const vfun = (e: any) => {};

  return (
    <div>
      <ConnectedControls />

      <h5>Saved Boards</h5>
      <Button variant="contained" color="primary">
        Save
      </Button>
      <BoardUI
        board={props.boardCells}
        interact={false}
        size={200}
        onEnterNum={vfun}
        onEnterSmallNum={vfun}
        onDelete={vfun}
      />
      <h5>History <LayersClearIcon onClick={props.clearHistory}/></h5>
      <History />
      <h5>External resources</h5>
      <a
        href={"https://www.sudokuwiki.org/sudoku.html?db=" + props.board}
        target="_blank"
        rel="noopener noreferrer"
      >
        Sudoku Wiki
      </a>
    </div>
  );
};

const encodeBoard = (cells: CellState[]) => {
  return cells.map(x => x.mainNum || "0").reduce((p, n) => p + n, "");
};

const mapStateToProps = (main: AppState) => {
  return {
    board: encodeBoard(main.cells),
    boardCells: main.cells,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<Actions>) => {
  return {
    clearHistory: () => dispatch(clearEvents()),
  };
};

export const ConnectedPanel = connect(
  mapStateToProps,
  mapDispatchToProps
)(Sidebar);
