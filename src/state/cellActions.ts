import {
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
  SEND_COORDINATE,
  CLEAR_HISTORY
} from "./actionTypes";
import { Coordinate } from "./model";

export type Actions =
  | InsertEvent
  | InsertSmallEvent
  | DeleteEvent
  | ResizeEvent
  | SidebarEvent
  | HighlightChangeEvent
  | ImportEvent
  | CoordinateEvent
  | PaintEvent
  | ClearHistoryEvent;

export type CoordinateEvent = {
  type: typeof SEND_COORDINATE;
  coordinate: Coordinate;
};

export type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

export type PaintEvent = {
  type: typeof PAINT;
  subtype: typeof BEGIN_PAINTING | typeof END_PAINTING;
};
export type ImportEvent = {
  type: typeof IMPORT;
  value: string;
};
export type ClearHistoryEvent = {
  type: typeof CLEAR_HISTORY;
}
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
  index: Array<number>;
  number: number;
};
export type InsertEvent = {
  type: typeof INSERT;
  index: number;
  number: number;
};

export type DeleteEvent = {
  type: typeof DELETE;
  index: Set<number>;
};
export type ResizeEvent =
  | {
      type: typeof RESIZE;
      size: number;
    }
  | {
      type: typeof RESIZE_START | typeof RESIZE_END;
    };

export function resize(size: number): ResizeEvent {
  return {
    type: RESIZE,
    size
  };
}

export function insertCell(index: number, number: number): InsertEvent {
  return {
    type: INSERT,
    index,
    number
  };
}

export function insertSmallCell(
  index: Array<number>,
  number: number
): InsertSmallEvent {
  return {
    type: INSERT_SMALL,
    number,
    index
  };
}

export function deleteCell(index: Set<number>): DeleteEvent {
  return {
    type: DELETE,
    index
  };
}
