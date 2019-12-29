import React, {
  Dispatch,
  Component
} from "react";
import { AppState, CellState } from "../state/model";
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

const rowStyle = {
  display: "flex",
  flexFlow: "row wrap",
  width: "450px"
};

type BoardProps = {
  board: Array<CellState>;
  selected: Array<number>;
  numbers: Array<number>;
  onClick: (argo0: number | null) => void;
  onEnterNum: (num: number) => void;
  onEnterSmallNum: (index: number, num: number) => void;
  onDelete: (index: number) => void;
  onDrag: (index: number) => void;
  onBlur: (index: number) => void;
  onMove: (direction: Direction) => void;
  onClickText: (number: number) => void;
};

class BoardUI extends Component<BoardProps> {
  render() {
    const board = this.props.board;
    let cells = board.map((cell, number) => {
      const onClick = () => this.props.onClick(number);
      const onDrag = () => this.props.onDrag(number);
      const onBlur = () => this.props.onBlur(number);
      const onInput = (val: number, isMeta: boolean) => {
        const key = String.fromCharCode(val)
        if (isNaN(parseInt(key))) {
          // check if it's backspace
          if(val === 8) {
            this.props.onDelete(number)
          }
          else if (val === 38) {
            this.props.onMove("UP")
          } else if(val === 37) {
            this.props.onMove("LEFT")
          } else if(val === 40) {
            this.props.onMove("DOWN")
          } else if(val === 39) {
            this.props.onMove("RIGHT")
          }
          return;
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
          highlight={this.props.numbers}
          selected={this.props.selected.indexOf(number) !== -1}
          focused={
            this.props.selected.indexOf(number) !== -1 &&
            this.props.selected.length === 1
          }
          onClickText={this.props.onClickText}
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

const mapStateToProps = (state: AppState) => {
  return {
    board: state.cells,
    selected: state.selectedCell,
    numbers: state.settings.enableHighlight ? state.selectedNumbers : []
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
    onClickText: (number: number) => {
      dispatch(clickText(number))
    }
  };
};

export const FilteredBoard = connect(
  mapStateToProps,
  mapDispatchToProps
)(BoardUI);
