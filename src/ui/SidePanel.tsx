import React, { PureComponent } from "react";
import pako from 'pako';
import { connect } from "react-redux";
import { AppState, CellState, Settings } from "../state/model";

type SidebarProps=  {
    board: string,
    settings: Settings,
    full: string,
}

class Sidebar extends PureComponent<SidebarProps> {
  render() {
    return (
      <div>
        <a
          href={
            "https://www.sudokuwiki.org/sudoku.html?db=" +this.props.board
          }
          target="_blank"
          rel="noopener noreferrer"

        >
          Sudoku Wiki
        </a>
      </div>
    );
  }
}

const encodeBoard = (cells: CellState[]) => {
    return cells.map(x => x.mainNum || "0").reduce((p, n) => p + n, "");
}
const encodeFull = (cells: CellState[]) => {
    const input:number[] = []
    cells.map(x => {
        if(x.mainNum != null) {
            return ((0x1 << (x.mainNum)) | 0x1)
        }
        let soln = 0;
        x.small.forEach(small => {
            soln |= (0x1 << (small))
        })
        return (soln);
    })
    .forEach(x => input.push(x))
    var out = pako.deflate(new Uint8Array(input), { to: 'string'})
    return btoa(out)
}

const mapStateToProps = (appState: AppState) => {
    return {
        board: encodeBoard(appState.cells),
        full: encodeFull(appState.cells),
        settings: appState.settings,
    }
}

export const ConnectedPanel = connect(mapStateToProps)(Sidebar)