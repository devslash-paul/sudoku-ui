import { AppState } from "./model";
import {
  Actions,
  Direction,
  InsertSmallEvent,
  SidebarEvent
} from "./cellActions";
import { getInitialState } from "./default";
import { SIDEBAR, NEW, HIGHLIGHT_CHANGE, IMPORT } from "./actionTypes";

const blur = (state: AppState, index: number): AppState => {
  return {
    ...state,
    selectedCell: [],
    selectedNumbers: []
  };
};

const doMove = (state: AppState, direction: Direction) => {
  let selected = state.selectedCell;
  if (selected != null && selected.length === 1) {
    let item = selected[0];
    switch (direction) {
      case "UP":
        item -= 9;
        break;
      case "DOWN":
        item += 9;
        break;
      case "LEFT":
        item -= 1;
        break;
      case "RIGHT":
        item += 1;
        break;
    }
    if (!(item < 0 || item >= 81)) {
      selected = [item];
    }
  }
  return {
    ...state,
    selectedCell: selected
  };
};

export function AppReducer(
  state: AppState = getInitialState(),
  action: Actions
): AppState {
  switch (action.type) {
    case "SELECT_CELL":
      const value = action.index != null ? [action.index] : [];
      return { ...state, selectedCell: value };
    case "INSERT":
      // only works with a single selection
      if (state.selectedCell.length !== 1) {
        return state;
      }
      const index = state.selectedCell[0];
      const newCells = [...state.cells];
      const n = newCells[index];
      newCells[index] = { ...n, mainNum: action.number };
      return { ...state, cells: newCells };
    case "INSERT_SMALL":
      return doInsertSmall(state, action);
    case "DELETE":
      if (state.selectedCell.length !== 1) {
        return state;
      }
      let deleteCell = state.cells[state.selectedCell[0]];
      let newDeleteCells = [...state.cells];
      if (deleteCell.mainNum == null) {
        deleteCell.small = [];
      } else {
        deleteCell.mainNum = null;
      }
      newDeleteCells[state.selectedCell[0]] = deleteCell;
      return {
        ...state,
        cells: newDeleteCells
      };
    case "DRAG_CELL":
      let newSelection =
        state.selectedCell.indexOf(action.index) === -1
          ? [...state.selectedCell, action.index]
          : state.selectedCell;
      return {
        ...state,
        selectedCell: newSelection
      };

    case "BLUR_CELL":
      return blur(state, action.index);
    case "MOVE":
      return doMove(state, action.direction);
    case "CLICK_TEXT":
      return doClickText(state, action.number);
    case SIDEBAR:
      return doSidebar(state, action);
    case HIGHLIGHT_CHANGE:
      return doChangeHighlight(state, action.value);
    case IMPORT:
      return doImport(state, action.value);
    default:
      return state;
  }
}

function doImport(state: AppState, value: string): AppState {
  let cells = new Array(81);
  for(let i = 0; i < 81; i++) {
    if(value.charAt(i) !== "0" && !isNaN(parseInt(value.charAt(i)))) {
      cells[i] = {mainNum: parseInt(value.charAt(i)), small:[]}
    } else {
      cells[i] = {mainNum: null, small: []}
    }
  }
  return {
    ...state,
    cells
  }
}

function doChangeHighlight(state: AppState, value: boolean): AppState {
  return {
    ...state, 
    settings: {
      ...state.settings,
      enableHighlight: value,
    }
  }
}

function doSidebar(state: AppState, action: SidebarEvent): AppState {
  switch (action.subtype) {
    case NEW:
      const newCells = new Array(81).fill({mainNum: null, small: []});
      return {
        ...state,
        cells: newCells,
        selectedCell: [],
        selectedNumbers: []
      };
  }
}

function doClickText(state: AppState, number: number) {
  let result;
  if (state.selectedNumbers.indexOf(number) === -1) {
    result = [...state.selectedNumbers, number];
  } else {
    result = [...state.selectedNumbers.filter(x => x !== number)];
  }
  return {
    ...state,
    selectedNumbers: result
  };
}

function doInsertSmall(state: AppState, action: InsertSmallEvent) {
  // Here - If all cells selected have the small thing, then we're deleting
  // otherwise we are adding
  const cells = [...state.cells];
  const adding = state.selectedCell
    .map(x => cells[x].small.indexOf(action.number) === -1)
    .reduce((p, n) => p || n, false);

  state.selectedCell.forEach(x => {
    const index = cells[x].small.indexOf(action.number);
    if (adding && index === -1) {
      cells[x].small = [...cells[x].small, action.number];
    } else if (!adding && index !== -1) {
      cells[x].small = cells[x].small.filter((x, n) => n !== index);
    }
  });
  return { ...state, cells };
}