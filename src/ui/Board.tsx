import React, {
  Dispatch,
  Component
} from "react";
import { AppState, CellState } from "../state/model";
import CSS from 'csstype';
import {
  selectCell,
  insertCell,
  insertSmallCell,
  Actions,
  deleteCell,
  dragCell,
  blurCell,
  Direction,
  move,
  clickText
} from "../state/cellActions";
import { connect } from "react-redux";
import { Cell } from "./Cell";

type BoardProps = {
  board: Array<CellState>;
  selected: Array<number>;
  numbers: Array<number>;
  size: number,
  onClick: (argo0: number | null) => void;
  onEnterNum: (num: number) => void;
  onEnterSmallNum: (index: number, num: number) => void;
  onDelete: (index: number) => void;
  onDrag: (index: number) => void;
  onBlur: (index: number) => void;
  onMove: (direction: Direction) => void;
  onClickText: (i: number, number: number, type: 'SINGLE'| 'DOUBLE') => void;
};

export class BoardUI extends Component<BoardProps> {
  render() {
    const rowStyle: CSS.Properties = {
      display: "flex",
      pointerEvents: 'all',
      flexFlow: "row wrap",
      width: `${this.props.size}px`,
      lineHeight: `${this.props.size}px`
    }
    const board = this.props.board;
    let cells = board.map((cell, number) => {
      const onClick = () => this.props.onClick(number);
      const onDrag = () => this.props.onDrag(number);
      const onBlur = () => this.props.onBlur(number);
      const onClickText = (val: number) => this.props.onClickText(number, val, 'SINGLE');
      const onDoubleClickText = (val: number) => this.props.onClickText(number, val, 'DOUBLE');
      const onInput = (val: number, isMeta: boolean) => {
        let key = String.fromCharCode(val)
        if (isNaN(parseInt(key))) {
          // check if it's backspace
          if (val === 8 || val === 46) {
            this.props.onDelete(number)
            return;
          }
          else if (val === 38) {
            this.props.onMove("UP")
            return;
          } else if (val === 37) {
            this.props.onMove("LEFT")
            return;
          } else if (val === 40) {
            this.props.onMove("DOWN")
            return;
          } else if (val === 39) {
            this.props.onMove("RIGHT")
            return;
          } else if (val >= 97 && val <= 105) {
            //todo: fix up this return nightmare
            key = String.fromCharCode(val - 48)
          } else {
            return;
          }
        }
        if (!isMeta) {
          this.props.onEnterNum(parseInt(key));
        } else {
          this.props.onEnterSmallNum(number, parseInt(key));
        }
      };
      return (
        <Cell
          key={number}
          number={cell.mainNum}
          small={cell.small}
          size={this.props.size / 9}
          highlight={this.props.numbers}
          selected={this.props.selected.indexOf(number) !== -1}
          focused={
            this.props.selected.indexOf(number) !== -1 &&
            this.props.selected.length === 1
          }
          onClickText={onClickText}
          onClick={onClick}
          onBlur={onBlur}
          onInput={onInput}
          onMouseover={onDrag}
        />
      );
    });
    return (
      <div
        tabIndex={1}
        className="box"
        style={rowStyle}
      >
        {cells}
      </div>
    );
  }
}


const mapStateToProps = (main: AppState) => {
  return {
    board: main.cells,
    selected: main.selectedCell,
    numbers: main.settings.enableHighlight ? main.selectedNumbers : [],
    size: main.settings.boardSize,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<Actions>) => {
  return {
    onClick: (index: number | null) => {
      dispatch(selectCell(index));
    },
    onEnterNum: (num: number) => {
      dispatch(insertCell(num));
    },
    onEnterSmallNum: (index: number, num: number) => {
      dispatch(insertSmallCell(index, num));
    },
    onDelete: (index: number) => {
      dispatch(deleteCell(index))
    },
    onDrag: (index: number) => {
      dispatch(dragCell(index))
    },
    onBlur: (index: number) => {
      dispatch(blurCell(index))
    },
    onMove: (direction: Direction) => {
      dispatch(move(direction))
    },
    onClickText: (index: number, number: number) => {
      dispatch(clickText(index, number));
    },
  };
};

export const FilteredBoard = connect(
  mapStateToProps,
  mapDispatchToProps
)(BoardUI);
