import { AppState, State } from "./model";
import { PaintEvent, Actions, CoordinateEvent } from "./cellActions";
import {
  BEGIN_PAINTING,
  PAINT,
  END_PAINTING,
  SEND_COORDINATE
} from "./actionTypes";

export function paintReducer(state: AppState, action: Actions): AppState {
  switch (action.type) {
    case PAINT:
      return doPaint(state, action);
    case SEND_COORDINATE:
      return doSendCoordinate(state, action);
  }
  return {
    ...state
  };
}

function doSendCoordinate(state: AppState, action: CoordinateEvent) {
  // we have to check the coordinate has a small in it
  const cell = state.cells[action.coordinate.cell];
  const small = cell.small;
  const coord = action.coordinate;
  const start = state.paintState.paintStart;
  if (
    start == null ||
    cell.mainNum != null ||
    small.indexOf(action.coordinate.subcell + 1) === -1
  ) {
    return state;
  }
  if (action.coordinate === state.paintState.paintStart) {
    // Lets flip the color, or cancel if nothing there.
    const links = [...state.paintState.links];
    return {
      ...state,
      paintState: {
        ...state.paintState,
        links,
        paintStart: null
      }
    };
  }
  const link = {
    start: start,
    end: coord
  };
  return {
    ...state,
    paintState: {
      ...state.paintState,
      links: [...state.paintState.links, link],
      paintStart: null
    }
  };
}

function doPaint(state: AppState, action: PaintEvent): AppState {
  switch (action.subtype) {
    case BEGIN_PAINTING:
      return {
        ...state,
        settings: {
          ...state.settings,
          state: State.PAINTING
        }
      };
    case END_PAINTING:
      return {
        ...state,
        settings: {
          ...state.settings,
          state: State.NORMAL
        },
        paintState: {
          links: [],
          paintStart: null
        }
      };
  }
}
