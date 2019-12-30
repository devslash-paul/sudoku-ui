import { AppReducer } from "./reducer";
import { createStore } from "redux";
import { composeWithDevTools } from 'redux-devtools-extension';

export const store = createStore(
  AppReducer,
  composeWithDevTools()
);

store.subscribe(() => localStorage.setItem("state", JSON.stringify(store.getState())));