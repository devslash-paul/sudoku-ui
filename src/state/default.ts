import { AppState, State } from "./model";
import { importFull } from "../transit";

export const getInitialState = () => {
  if(window.location.pathname.startsWith("/share/")) {
    let path = window.location.pathname.substring("/share/".length)
    window.history.pushState({}, "Sudoku UI", "/")
    return {
      ...defaultState, 
      settings: {
        ...defaultState.settings, 
        frozen: false,
      },
      cells: importFull(path)
    }
  }
  const res =localStorage.getItem('state');
  if (res != null) {
    return JSON.parse(res);
  }
  return {
    ...defaultState,
    settings: {
      ...defaultState.settings,
      frozen: false // you can never load a frozen state
    }
  }
}

const defaultState: AppState = {
  history: {
    items: [],
    activeItem: -1,
  },
  paintState: {
    links: [],
    paintStart: null,
  },
  settings: {
    state: State.NORMAL,
    enableHighlight: false,
    boardSize: 450,
  },
  cells: [
    {
      mainNum: 9,
      small: []
    },
    {
      mainNum: null,
      small: [2, 1, 3]
    },
    {
      mainNum: null,
      small: [2, 1, 3]
    },
    {
      mainNum: null,
      small: [4, 6, 1]
    },
    {
      mainNum: 5,
      small: []
    },
    {
      mainNum: null,
      small: [4, 1, 7]
    },
    {
      mainNum: null,
      small: [3, 7]
    },
    {
      mainNum: 8,
      small: []
    },
    {
      mainNum: null,
      small: [6, 1, 7]
    },
    {
      mainNum: null,
      small: [1, 3, 5]
    },
    {
      mainNum: 4,
      small: [4]
    },
    {
      mainNum: 8,
      small: []
    },
    {
      mainNum: null,
      small: [6, 1, 2]
    },
    {
      mainNum: null,
      small: [2, 7]
    },
    {
      mainNum: null,
      small: [1, 2, 7]
    },
    {
      mainNum: 9,
      small: []
    },
    {
      mainNum: null,
      small: [3, 5, 1]
    },
    {
      mainNum: null,
      small: [6, 1, 7]
    },
    {
      mainNum: null,
      small: [7, 1, 5]
    },
    {
      mainNum: 6,
      small: [6]
    },
    {
      mainNum: null,
      small: [7, 1, 5]
    },
    {
      mainNum: 3,
      small: []
    },
    {
      mainNum: null,
      small: [8, 9]
    },
    {
      mainNum: null,
      small: [8, 9]
    },
    {
      mainNum: 2,
      small: []
    },
    {
      mainNum: null,
      small: [5, 1]
    },
    {
      mainNum: 4,
      small: []
    },
    {
      mainNum: null,
      small: [1, 8]
    },
    {
      mainNum: null,
      small: [1, 2, 3, 8]
    },
    {
      mainNum: null,
      small: [1, 2, 3]
    },
    {
      mainNum: 7,
      small: []
    },
    {
      mainNum: null,
      small: [9, 2, 4, 8]
    },
    {
      mainNum: null,
      small: [1, 9, 2, 4, 8]
    },
    {
      mainNum: null,
      small: [3, 4]
    },
    {
      mainNum: 6,
      small: []
    },
    {
      mainNum: 5,
      small: []
    },
    {
      mainNum: null,
      small: [7, 5, 3, 8]
    },
    {
      mainNum: null,
      small: [7, 2, 3, 8]
    },
    {
      mainNum: 6,
      small: []
    },
    {
      mainNum: null,
      small: [5, 2, 4, 8]
    },
    {
      mainNum: null,
      small: [2, 4, 8]
    },
    {
      mainNum: null,
      small: [2, 4, 8]
    },
    {
      mainNum: 1,
      small: []
    },
    {
      mainNum: null,
      small: [3, 4]
    },
    {
      mainNum: 9,
      small: []
    },
    {
      mainNum: 4,
      small: []
    },
    {
      mainNum: 9,
      small: []
    },
    {
      mainNum: null,
      small: [5, 1]
    },
    {
      mainNum: null,
      small: [1, 5]
    },
    {
      mainNum: 6,
      small: [6]
    },
    {
      mainNum: 3,
      small: []
    },
    {
      mainNum: null,
      small: [7, 8]
    },
    {
      mainNum: 2,
      small: [2]
    },
    {
      mainNum: null,
      small: [7, 8]
    },
    {
      mainNum: 2,
      small: []
    },
    {
      mainNum: null,
      small: [3, 7, 8]
    },
    {
      mainNum: 9,
      small: []
    },
    {
      mainNum: null,
      small: [4, 7, 8]
    },
    {
      mainNum: null,
      small: [3, 4, 7, 8]
    },
    {
      mainNum: 6,
      small: []
    },
    {
      mainNum: 5,
      small: [5]
    },
    {
      mainNum: null,
      small: [1, 4]
    },
    {
      mainNum: null,
      small: [1, 8]
    },
    {
      mainNum: null,
      small: [1, 3, 8]
    },
    {
      mainNum: null,
      small: [1, 3, 8]
    },
    {
      mainNum: 4,
      small: []
    },
    {
      mainNum: 9,
      small: [5]
    },
    {
      mainNum: null,
      small: [3, 8]
    },
    {
      mainNum: 5,
      small: [5]
    },
    {
      mainNum: 6,
      small: []
    },
    {
      mainNum: 7,
      small: []
    },
    {
      mainNum: 2,
      small: [2]
    },
    {
      mainNum: 6,
      small: []
    },
    {
      mainNum: 5,
      small: []
    },
    {
      mainNum: null,
      small: [7, 8]
    },
    {
      mainNum: null,
      small: [2, 4, 7, 8]
    },
    {
      mainNum: 1,
      small: []
    },
    {
      mainNum: null,
      small: [2, 4, 7, 8]
    },
    {
      mainNum: null,
      small: [4, 8]
    },
    {
      mainNum: 9,
      small: [2]
    },
    {
      mainNum: 3,
      small: []
    }
  ],
};
