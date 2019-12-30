import { AppState, State } from "./model";
import { PaintEvent, Actions, ClickTextEvent } from "./cellActions";
import { BEGIN_PAINTING, PAINT, END_PAINTING, CLICK_TEXT } from "./actionTypes";


export function paintReducer(state: AppState, action: Actions): AppState {
    switch(action.type) {
        case PAINT:
            return doPaint(state, action);
        case CLICK_TEXT:
            return doStartLine(state, action);
    }
    return {
        ...state,
    }
}

function doStartLine(state: AppState, action: ClickTextEvent) {
    return {
        ...state
    }
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
        }
      };
  }
}
