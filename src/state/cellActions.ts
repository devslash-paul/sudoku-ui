import {
  SELECT_CELL,
  INSERT,
  INSERT_SMALL,
  DELETE,
  DRAG_CELL,
  SIDEBAR,
  BLUR_CELL,
  MOVE,
  CLICK_TEXT,
  NEW,
  HIGHLIGHT_CHANGE,
  IMPORT,
  RESIZE,
  RESIZE_START,
  PAINT,
  RESIZE_END,
  BEGIN_PAINTING,
  END_PAINTING,
  SEND_COORDINATE
} from "./actionTypes";
import { Coordinate } from "./model";

export type Actions =
  | SelectEvent
  | InsertEvent
  | InsertSmallEvent
  | DeleteEvent
  | DragCellEvent
  | BlurEvent
  | ResizeEvent
  | MoveEvent
  | ClickTextEvent
  | SidebarEvent
  | HighlightChangeEvent
  | ImportEvent
  | CoordinateEvent
  | PaintEvent;

export type CoordinateEvent = {
  type: typeof SEND_COORDINATE,
  coordinate: Coordinate
}

export type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

export type PaintEvent = {
  type: typeof PAINT,
  subtype: typeof BEGIN_PAINTING | typeof END_PAINTING
}
export type ImportEvent = {
  type: typeof IMPORT;
  value: string;
};
export type SidebarEvent = {
  type: typeof SIDEBAR;
  subtype: typeof NEW;
};

export type HighlightChangeEvent = {
  type: typeof HIGHLIGHT_CHANGE;
  value: boolean;
};

export type ClickTextEvent = {
  type: typeof CLICK_TEXT;
  index: number;
  number: number;
  clickType: 'SINGLE' | 'DOUBLE';
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
export type ResizeEvent = {
  type: typeof RESIZE
  size: number;
} | {
  type: typeof RESIZE_START | typeof RESIZE_END
};

export function resize(size: number): ResizeEvent {
  return {
    type: RESIZE,
    size
  };
}

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

export function clickText(index: number, number: number, clickType: 'SINGLE' | 'DOUBLE'): ClickTextEvent {
  return {
    type: CLICK_TEXT,
    index,
    number,
    clickType,
  };
}
