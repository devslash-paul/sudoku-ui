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
import { Grid } from "@material-ui/core";
import CreateIcon from "@material-ui/icons/Create";
import CreateOutlinedIcon from "@material-ui/icons/CreateOutlined";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";

const cellStyle: CSS.Properties = {
  height: "33px",
  width: "33px",
  border: "1px solid black",
  lineHeight: "32px",
  letterSpacing: "6px",
  borderRadius: "3px"
};

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
  const boxStyle = {
    margin: "0px",
    borderRadius: "0",
    flexGrow: 1,
    borderBottom: "1px solid gray"
  };
  const topLeft: CSS.Properties = {
    borderTopLeftRadius: "10px",
    borderRight: "1px solid gray"
  };
  const topRight: CSS.Properties = {
    borderTopRightRadius: "10px",
    borderLeft: "1px solid gray"
  };
  const vfun = (e: any) => {};

  return (
    <div>
      <Grid container>
        <Button
          disableElevation
          style={{ ...boxStyle, ...topLeft }}
          variant="contained"
          onClick={props.onNew}
        >
          New
        </Button>
        <Button
          disableElevation
          style={boxStyle}
          variant="contained"
          onClick={e => onImportClicked(props.doImport)}
        >
          Import
        </Button>
        <Button
          disableElevation
          style={{ ...boxStyle, ...topRight }}
          variant="contained"
          onClick={() => doExport(addToast, props.full)}
        >
          Share
        </Button>
      </Grid>
      <Grid container>
        <ToggleButtonGroup size="small" style={boxStyle}>
          <ToggleButton size={"small"} selected={true} style={boxStyle}>
            Enable Highlights
          </ToggleButton>
          <ToggleButton selected={false} style={boxStyle}>
            Enable Highlights
          </ToggleButton>
        </ToggleButtonGroup>
      </Grid>
      <Grid>
        <Button variant="contained">
          <span style={cellStyle}>
            <div>1</div>
          </span>
        </Button>
        <Button variant="contained">
          <span
            style={{
              ...cellStyle,
              ...{
                fontSize: "11px",
                lineHeight: "11px",
                display: "flex",
                flexWrap: "wrap"
              }
            }}
          >
            <div style={{ flexBasis: "100%" }}>123</div>
            <div style={{ flexBasis: "100%" }}>456</div>
            <div style={{ flexBasis: "100%" }}>789</div>
          </span>
        </Button>
      </Grid>
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
