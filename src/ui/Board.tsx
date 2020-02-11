import React, { Dispatch, useState } from "react";
import { AppState, CellState, State } from "../state/model";
import CSS from "csstype";
import {
  insertCell,
  insertSmallCell,
  Actions,
  deleteCell,
  Direction
} from "../state/cellActions";
import { connect } from "react-redux";
import { Cell } from "./Cell";

type BoardProps = {
  board: Array<CellState>;
  size: number;
  interact: boolean;
  onEnterNum: (index: number, num: number) => void;
  onEnterSmallNum: (index: Array<number>, num: number) => void;
  onDelete: (index: Set<number>) => void;
};

const onMove = (
  selectedState: Set<number>,
  setSelected: Dispatch<React.SetStateAction<Set<number>>>
) => {
  return (direction: Direction) => {
    if (selectedState.size !== 1) {
      return;
    }

    let original = selectedState.values().next().value;
    let selection = original;
    switch (direction) {
      case "UP":
        selection -= 9;
        break;
      case "DOWN":
        selection += 9;
        break;
      case "LEFT":
        selection -= 1;
        break;
      case "RIGHT":
        selection += 1;
        break;
    }
    if (selection <= -1) selection = original;
    if (selection >= 81) selection = original;
    const res: Set<number> = new Set();
    res.add(selection);
    setSelected(res);
  };
};

const onInput = (
  index: number,
  selectedState: Set<number>,
  doMove: (d: Direction) => void,
  onDelete: (idx: Set<number>) => void,
  props: BoardProps
) => {
  return (val: number, shift: boolean, meta: boolean) => {
    if (val === 46 || val === 8) {
      return onDelete(selectedState);
    }
    if(meta) {
      return;
    }
    if ((val >= 49 && val <= 57) || (val >= 97 && val <= 105)) {
      // we have a number entered. Lets quickly normalize the numpad
      if (val > 57) {
        val -= 48;
      }
      val -= 48;
      if (!shift && selectedState.size === 1) {
        props.onEnterNum(selectedState.values().next().value, val);
      } else if (shift) {
        props.onEnterSmallNum(Array.from(selectedState), val);
      }
    } else if (val === 8 || val === 46) {
      return onDelete(selectedState);
    }
    if (selectedState.size === 1) {
      if (val === 38) {
        return doMove("UP");
      } else if (val === 37) {
        return doMove("LEFT");
      } else if (val === 40) {
        return doMove("DOWN");
      } else if (val === 39) {
        return doMove("RIGHT");
      }
    }
  };
};

type Highlight = number | null;

export const BoardUI = (props: BoardProps) => {
  const rowStyle: CSS.Properties = {
    display: "flex",
    pointerEvents: "all",
    flexFlow: "row wrap",
    width: `${props.size}px`,
    lineHeight: `${props.size}px`
  };
  const { interact } = props;
  const defaultSelectedCell: Set<number> = new Set();
  const [selectedState, setSelected] = useState(defaultSelectedCell);
  const [highlightState, setHighlight] = useState<Highlight>(null);

  const board = props.board;
  let cells = board.map((cell, index) => {
    const onDrag = () => {
      if (!interact) {
        return;
      }
      const res = new Set(selectedState);
      res.add(index);
      setSelected(res);
    };
    const onBlur = () => {
      if (!interact) {
        return;
      }
      setHighlight(null);
    };
    const onClickText = (val: number) => {
      if (!interact) {
        return;
      }
      setHighlight(val);
    };
    const select = (meta: boolean) => {
      if (!interact) {
        return;
      }
      if (!meta) {
        const res: Set<number> = new Set();
        res.add(index);
        setSelected(res);
      } else {
        const res = new Set(selectedState);
        res.add(index);
        setSelected(res);
      }
    };
    return (
      <Cell
        key={index}
        number={cell.mainNum}
        small={cell.small}
        cells={9}
        size={props.size / 9}
        highlight={highlightState}
        selected={selectedState.has(index)}
        focused={selectedState.has(index) && selectedState.size === 1}
        onClickText={onClickText}
        onClick={select}
        onBlur={onBlur}
        onInput={onInput(
          index,
          selectedState,
          onMove(selectedState, setSelected),
          props.onDelete,
          props
        )}
        onMouseover={onDrag}
      />
    );
  });
  return (
    <div tabIndex={1} className="box" style={rowStyle}>
      {cells}
    </div>
  );
};

const mapStateToProps = (main: AppState) => {
  return {
    board: main.cells,
    size: main.settings.boardSize,
    interact: main.settings.state === State.NORMAL
  };
};

const mapDispatchToProps = (dispatch: Dispatch<Actions>) => {
  return {
    onEnterNum: (index: number, num: number) => {
      dispatch(insertCell(index, num));
    },
    onEnterSmallNum: (index: Array<number>, num: number) => {
      dispatch(insertSmallCell(index, num));
    },
    onDelete: (index: Set<number>) => {
      dispatch(deleteCell(index));
    }
  };
};

export const FilteredBoard = connect(
  mapStateToProps,
  mapDispatchToProps
)(BoardUI);
