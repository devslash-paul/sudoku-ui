import React, { Dispatch } from "react";
import { useToasts } from "react-toast-notifications";
import CSS from "csstype";
import { connect } from "react-redux";
import { AppState, CellState, Settings, State } from "../state/model";
import Button from "@material-ui/core/Button";
import {
  onNew,
  onSetHighlight,
  onImport,
  onChangePainting
} from "../state/sidebarActions";
import { Actions } from "../state/cellActions";
import { BoardUI } from "./Board";
import { Box } from "@material-ui/core";

type SidebarProps = {
  board: string;
  settings: Settings;
  full: string;
  painting: boolean;
  boardCells: Array<CellState>;

  onNew: () => void;
  onChangeHighlight: (e1: boolean) => void;
  onChangePainting: (e1: boolean) => void;
  doImport: (board: string) => void;
};

const onImportClicked = (doImport: (e1: string) => void) => {
  const response = window.prompt("Please enter the sodoku: ");
  if (response !== null) {
    doImport(response);
  }
};

const doExport = (addToast: any, board: string) => {
  navigator.clipboard.writeText(board);
  addToast("URL copied to clipboard", { appearance: "info" });
};
const Sidebar = (props: SidebarProps) => {
  const { addToast } = useToasts();
  const boxStyle = { margin: "0px", borderRadius: "0" };
  const topLeft: CSS.Properties = {
    borderTopLeftRadius: "10px"
  };
  const topRight: CSS.Properties = {
    borderTopRightRadius: "10px"
  };
  const vfun = (e: any) => {};

  return (
    <div>
      <h5>SudokuUI</h5>
      <Box component="span">
        <Button
          style={{ ...boxStyle, ...topLeft }}
          variant="contained"
          onClick={props.onNew}
        >
          New
        </Button>
        <Button
          style={boxStyle}
          variant="contained"
          onClick={e => onImportClicked(props.doImport)}
        >
          Import
        </Button>
        <Button
          style={{ ...boxStyle, ...topRight }}
          variant="contained"
          onClick={() => doExport(addToast, props.full)}
        >
          Share
        </Button>
      </Box>
      <h5>Settings</h5>
      <div>
        <label htmlFor="highlight">Enable Highlights</label>
        <input
          id="highlight"
          type="checkbox"
          checked={props.settings.enableHighlight}
          onChange={e => props.onChangeHighlight(e.target.checked)}
        />
      </div>
      <div>
        <label htmlFor="painting">Enable Painting</label>
        <input
          id="painting"
          type="checkbox"
          checked={props.painting}
          onChange={e => props.onChangePainting(e.target.checked)}
        />
      </div>

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
const encodeFull = (cells: CellState[]) => {
  const nums = cells
    .map(x => {
      if (x.mainNum == null) {
        return 0;
      }
      return x.mainNum;
    })
    .map(x => x.toString(2).padStart(4, "0"))
    .reduce((p, n) => p + n, "");
  const val = BigInt("0b" + nums);
  return val.toString(36);
};

const mapStateToProps = (main: AppState) => {
  return {
    board: encodeBoard(main.cells),
    full: encodeFull(main.cells),
    settings: main.settings,
    boardCells: main.cells,
    painting: main.settings.state === State.PAINTING
  };
};

const mapDispatchToProps = (dispatch: Dispatch<Actions>) => {
  return {
    onNew: () => dispatch(onNew()),
    onChangeHighlight: (value: boolean) => dispatch(onSetHighlight(value)),
    onChangePainting: (value: boolean) => dispatch(onChangePainting(value)),
    doImport: (value: string) => dispatch(onImport(value))
  };
};

export const ConnectedPanel = connect(
  mapStateToProps,
  mapDispatchToProps
)(Sidebar);
