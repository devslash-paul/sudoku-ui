import React from "react";
import "./App.css";
import { FilteredBoard } from "./ui/Board";
import { store } from "./state/store";
import { Provider } from "react-redux";
import { ConnectedPanel } from "./ui/SidePanel";

const App: React.FC = () => {
  return (
    <div>
      <Provider store={store}>
        <FilteredBoard />
        <ConnectedPanel />
      </Provider>
    </div>
  );
};

export default App;
