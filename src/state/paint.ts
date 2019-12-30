import { AppState, State } from "./model";
import { PaintEvent } from "./cellActions";
import { BEGIN_PAINTING, PAINT, END_PAINTING } from "./actionTypes";

export type PaintState = {

}

export function paintReducer(state: PaintState, action: any): PaintState {
    return {
        ...state,
    }
}

export function doPaint(state: AppState, action: PaintEvent): AppState {
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
        }
      };
  }
}
