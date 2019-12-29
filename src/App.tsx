import React from "react";
import "./App.css";
import { ToastProvider, useToasts } from 'react-toast-notifications'
import { FilteredBoard } from "./ui/Board";
import { store } from "./state/store";
import { Provider } from "react-redux";
import { ConnectedPanel } from "./ui/SidePanel";
import { Skeleton } from "./ui/Skeleton";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ToastProvider>
        <Skeleton board={<FilteredBoard />} side={<ConnectedPanel />} />
      </ToastProvider>
    </Provider>
  );
};

export default App;
