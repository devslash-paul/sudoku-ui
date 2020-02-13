import { AppState, State, AppEvent } from "./model";
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
  INSERT_SMALL,
  INSERT,
  DELETE,
  CLEAR_HISTORY
} from "./actionTypes";
import { paintReducer } from "./paint";
import { collapseHistory } from "./history";

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
    case INSERT:
      return doInsert(state, action.index, action.number);
    case INSERT_SMALL:
      return doInsertSmall(state, action);
    case DELETE:
      return doDelete(state, action);
    case HIGHLIGHT_CHANGE:
      return doChangeHighlight(state, action.value);
    case SIDEBAR:
      return doSidebar(state, action);
    case IMPORT:
      return doImport(state, action.value);
    case CLEAR_HISTORY: 
      return doClearHistory(state);
    default:
      return state;
  }
}

function doClearHistory(state: AppState) : AppState {
  return {
    ...state,
    history: {
      items: [],
      activeItem: -1
    }
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

  if(cell.mainNum === value) {
    // no op
    return state;
  }

  newCells[idx] = { ...cell, mainNum: value };
  const history: Array<AppEvent> = [...state.history.items, { kind: "ADD", large: value, index: [idx] }]
  return { ...state, cells: newCells, history: {
    items: history,
    activeItem: history.length - 1
  } };
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
        history: {items: [], activeItem: -1}
      };
  }
}

function doInsertSmall(state: AppState, action: InsertSmallEvent) : AppState {
  const cells = [...state.cells];
  const validIdx = action.index.filter(x => cells[x].mainNum == null)
  const adding = validIdx
    .map(x => cells[x].small.indexOf(action.number) === -1)
    .reduce((p, n) => p || n, false);

  validIdx.forEach(index => {
    const alreadyHas = cells[index].small.indexOf(action.number) !== -1;
    if (adding && !alreadyHas) {
      cells[index] = {
        ...cells[index],
        small: [...cells[index].small, action.number]
      };
    } else if (!adding && alreadyHas) {
      cells[index] = {
        ...cells[index],
        small: cells[index].small.filter(s => s !== action.number)
      };
    }
  });
  const hist: Array<AppEvent> = validIdx.map(i => {
    return {
      kind: adding ? "ADD": "REMOVE",
      index: [i],
      small: [action.number]
    }
  })
  const history = [...state.history.items, ...collapseHistory(hist)];
  return {
    ...state, 
    cells: [...cells],
    history: {
      items: history,
      activeItem: history.length - 1,
    }
  };
}

function doDelete(state: AppState, action: DeleteEvent) {
  let iState = [...state.cells];
  let historyItem: Array<AppEvent> = [];
  action.index.forEach(idx => {
    let deleteCell = state.cells[idx];
    const newDeleteCells = [...iState];
    if (deleteCell.mainNum == null) {
      historyItem.push({kind: "REMOVE", index: [idx], small: deleteCell.small})
      deleteCell = {
        ...deleteCell,
        small: []
      };
    } else {
      historyItem.push({kind: "REMOVE", index: [idx], large: deleteCell.mainNum})
      deleteCell = {
        ...deleteCell,
        mainNum: null
      };
    }
    newDeleteCells[idx] = deleteCell;
    iState = [...newDeleteCells];
  });
  const historyItems: Array<AppEvent> = [...state.history.items, ...collapseHistory(historyItem)]

  return {
    ...state,
    cells: iState,
    history: {
      ...state.history,
      items: historyItems,
      activeItem: historyItems.length - 1
    },
  };
}
