import {
  SELECT_CELL,
  INSERT,
  INSERT_SMALL,
  DELETE,
  DRAG_CELL,
  BLUR_CELL,
  MOVE,
  CLICK_TEXT
} from "./actionTypes";

export type Actions =
  | SelectEvent
  | InsertEvent
  | InsertSmallEvent
  | DeleteEvent
  | DragCellEvent
  | BlurEvent
  | MoveEvent
  | ClickTextEvent;

export type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

export type ClickTextEvent = {
  type: typeof CLICK_TEXT;
  number: number;
};

export type MoveEvent = {
  type: typeof MOVE;
  direction: Direction;
};
export type BlurEvent = {
  type: typeof BLUR_CELL;
  index: number;
};
export type DragCellEvent = {
  type: typeof DRAG_CELL;
  index: number;
};
export type InsertSmallEvent = {
  type: typeof INSERT_SMALL;
  index: number;
  number: number;
};
export type InsertEvent = {
  type: typeof INSERT;
  number: number;
};
export type SelectEvent = {
  type: typeof SELECT_CELL;
  index: number | null;
};

export type DeleteEvent = {
  type: typeof DELETE;
  index: number;
};

export function selectCell(index: number | null): SelectEvent {
  return {
    type: SELECT_CELL,
    index
  };
}

export function insertCell(number: number): InsertEvent {
  return {
    type: INSERT,
    number
  };
}

export function insertSmallCell(
  index: number,
  number: number
): InsertSmallEvent {
  return {
    type: INSERT_SMALL,
    number,
    index
  };
}
export function dragCell(index: number): DragCellEvent {
  return {
    type: DRAG_CELL,
    index
  };
}

export function deleteCell(index: number): DeleteEvent {
  return {
    type: DELETE,
    index
  };
}

export function blurCell(index: number): BlurEvent {
  return {
    type: BLUR_CELL,
    index
  };
}

export function move(direction: Direction): MoveEvent {
  return {
    type: MOVE,
    direction
  };
}

export function clickText(number: number): ClickTextEvent {
  return {
    type: CLICK_TEXT,
    number
  };
}
