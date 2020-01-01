import { AppState, State } from "./model";
import {
  Actions,
  InsertSmallEvent,
  SidebarEvent,
  DeleteEvent,
  ResizeEvent
} from "./cellActions";
import { getInitialState } from "./default";
import {
  SIDEBAR,
  NEW,
  HIGHLIGHT_CHANGE,
  IMPORT,
  RESIZE,
  RESIZE_START,
  RESIZE_END,
  PAINT,
} from "./actionTypes";
import { paintReducer } from "./paint";

const validStateAction = (state: State, action: Actions) => {
  switch (state) {
    case State.NORMAL:
      // All things can happen when state is normal
      return true;
    case State.FROZEN:
      return (
        action.type === RESIZE ||
        action.type === RESIZE_END ||
        action.type === RESIZE_START
      );
  }
  return true;
};

function isPainting(state: AppState, action: Actions) {
  return state.settings.state === State.PAINTING || action.type === PAINT;
}

export function AppReducer(
  state: AppState = getInitialState(),
  action: Actions
): AppState {
  if (!validStateAction(state.settings.state, action)) {
    return state;
  }

  if (isPainting(state, action)) {
    return paintReducer(state, action);
  }

  switch (action.type) {
    case RESIZE:
    case RESIZE_START:
    case RESIZE_END:
      return doResize(state, action);
    case "INSERT":
      return doInsert(state, action.index, action.number);
    case "INSERT_SMALL":
      return doInsertSmall(state, action);
    case "DELETE":
      return doDelete(state, action);
    case HIGHLIGHT_CHANGE:
      return doChangeHighlight(state, action.value);
    case SIDEBAR:
      return doSidebar(state, action);
    case IMPORT:
      return doImport(state, action.value);
    default:
      return state;
  }
}

function doResize(state: AppState, data: ResizeEvent): AppState {
  if (data.type === RESIZE) {
    return {
      ...state,
      settings: {
        ...state.settings,
        boardSize: data.size
      }
    };
  }
  const freeze = data.type === RESIZE_START;
  return {
    ...state,
    settings: {
      ...state.settings,
      state: freeze ? State.FROZEN : State.NORMAL
    }
  };
}

function doInsert(state: AppState, idx: number, value: number): AppState {
  // only works with a single selection
  const newCells = [...state.cells];
  const cell = newCells[idx];
  newCells[idx] = { ...cell, mainNum: value };
  return { ...state, cells: newCells };
}

function doImport(state: AppState, value: string): AppState {
  let cells = new Array(81);
  for (let i = 0; i < 81; i++) {
    if (value.charAt(i) !== "0" && !isNaN(parseInt(value.charAt(i)))) {
      cells[i] = { mainNum: parseInt(value.charAt(i)), small: [] };
    } else {
      cells[i] = { mainNum: null, small: [] };
    }
  }
  return {
    ...state,
    cells
  };
}

function doChangeHighlight(state: AppState, value: boolean): AppState {
  return {
    ...state,
    settings: {
      ...state.settings,
      enableHighlight: value
    }
  };
}

function doSidebar(state: AppState, action: SidebarEvent): AppState {
  switch (action.subtype) {
    case NEW:
      const newCells = new Array(81).fill({ mainNum: null, small: [] });
      return {
        ...state,
        cells: newCells,
      };
  }
}

function doInsertSmall(state: AppState, action: InsertSmallEvent) {
  const cells = [...state.cells];
  const adding = action.index
    .map(x => cells[x].small.indexOf(action.number) === -1)
    .reduce((p, n) => p || n, false);

  action.index.forEach(x => {
    const index = cells[x].small.indexOf(action.number);
    if (adding && index === -1) {
      cells[x].small = [...cells[x].small, action.number];
    } else if (!adding && index !== -1) {
      cells[x].small = cells[x].small.filter((x, n) => n !== index);
    }
  });
  return { ...state, cells };
}

function doDelete(state: AppState, action: DeleteEvent) {
  // if (state.selectedCell.length !== 1) {
  //   return state;
  // }
  // const index = state.selectedCell[0];
  // let deleteCell = state.cells[index];
  // const newDeleteCells = [...state.cells];

  // if (deleteCell.mainNum == null) {
  //   deleteCell = {
  //     ...deleteCell,
  //     small: []
  //   };
  // } else {
  //   deleteCell = {
  //     ...deleteCell,
  //     mainNum: null
  //   };
  // }
  // newDeleteCells[index] = deleteCell;
  return {
    ...state,
    // cells: newDeleteCells
  };
}
