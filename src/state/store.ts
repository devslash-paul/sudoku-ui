import { AppReducer } from "./reducer";
import { createStore } from "redux";
import { composeWithDevTools } from 'redux-devtools-extension';
import { combineReducers } from "redux";
import { paintReducer } from "./paint";

export const store = createStore(
  combineReducers({ main: AppReducer, paint: paintReducer }),
  composeWithDevTools()
);

store.subscribe(() => localStorage.setItem("state", JSON.stringify(store.getState())));