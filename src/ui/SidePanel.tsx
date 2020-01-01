import React, { Dispatch } from "react";
import { useToasts } from "react-toast-notifications";
import { connect } from "react-redux";
import { AppState, CellState, Settings, State } from "../state/model";
import { onNew, onSetHighlight, onImport, onChangePainting } from "../state/sidebarActions";
import { Actions } from "../state/cellActions";
import { BoardUI } from "./Board";

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
  addToast("URL copied to clipboard", { appearance: 'info' });
};
const Sidebar = (props: SidebarProps) => {
  const { addToast } = useToasts();
  const vfun = (e: any) => {}

  return (
    <div>
      <h5>SudokuUI</h5>
      <button onClick={props.onNew}>New</button>
      <button onClick={e => onImportClicked(props.doImport)}>Import</button>
      <button onClick={() => doExport(addToast, props.full)}>Share</button>
      <h5>Settings</h5>
      <label htmlFor="highlight">Enable Highlights</label>
      <input
        id="highlight"
        type="checkbox"
        checked={props.settings.enableHighlight}
        onChange={e => props.onChangeHighlight(e.target.checked)}
      />
      <label htmlFor="painting">Enable Painting</label>
      <input
        id="painting"
        type="checkbox"
        checked={props.painting}
        onChange={e => props.onChangePainting(e.target.checked)}
      />

      <h5>Saved Boards</h5>
      <button>Save</button>
      <BoardUI
        board={props.boardCells}
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
  const nums = cells.map(x => {
    if(x.mainNum == null) {
      return 0;
    }
    return x.mainNum
  }).map(x => x.toString(2).padStart(4, "0"))
  .reduce((p,n) => p + n, "")
  const val = (BigInt("0b" + nums))
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
