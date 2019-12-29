import React, { Dispatch } from "react";
import pako from 'pako';
import { useToasts } from "react-toast-notifications";
import { connect } from "react-redux";
import { AppState, CellState, Settings } from "../state/model";
import { onNew, onSetHighlight, onImport } from "../state/sidebarActions";
import { Actions } from "../state/cellActions";
import { parse } from "path";

type SidebarProps = {
  board: string;
  settings: Settings;
  full: string;

  onNew: () => void;
  onChangeHighlight: (e1: boolean) => void;
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
  // const input: number[] = [];
  // cells
  //   .map(x => {
  //     if (x.mainNum != null) {
  //       return (0x1 << x.mainNum) | 0x1;
  //     }
  //     let soln = 0;
  //     x.small.forEach(small => {
  //       soln |= 0x1 << small;
  //     });
  //     return soln;
  //   })jjj
  //   .forEach(x => input.push(x));
  // var out = pako.deflate(new Uint8Array(input), { to: "string" });
  // lets start by not supporting the large ones
  // the largest number that i'm encoding is 1001
  // therefore i can get 2 cells per byte
  const nums = cells.map(x => {
    if(x.mainNum == null) {
      return 0;
    }
    return x.mainNum
  }).map(x => x.toString(2).padStart(4, "0"))
  .reduce((p,n) => p + n, "")
  // const compressed = pako.deflate(nums)
  // console.log("Compres")
  const val = (BigInt("0b" + nums))
  return val.toString(36);
  // console.log(pako.inflate(compressed, { to: 'string'}))
  // console.log(compressed)
  // return btoa(compressed.toString())
  // return Buffer.from(JSON.stringify(cells)).toString('base64')
};

const mapStateToProps = (appState: AppState) => {
  return {
    board: encodeBoard(appState.cells),
    full: encodeFull(appState.cells),
    settings: appState.settings
  };
};

const mapDispatchToProps = (dispatch: Dispatch<Actions>) => {
  return {
    onNew: () => dispatch(onNew()),
    onChangeHighlight: (value: boolean) => dispatch(onSetHighlight(value)),
    doImport: (value: string) => dispatch(onImport(value))
  };
};

export const ConnectedPanel = connect(
  mapStateToProps,
  mapDispatchToProps
)(Sidebar);
