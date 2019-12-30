import React from "react";
import "./App.css";
import { ToastProvider } from "react-toast-notifications";
import { FilteredBoard } from "./ui/Board";
import { store } from "./state/store";
import { Provider } from "react-redux";
import { ConnectedPanel } from "./ui/SidePanel";
import { Skeleton } from "./ui/Skeleton";
import { ResizePanel } from "./ui/ResizeablePanel";
import { Paint } from "./ui/Painter";

const App: React.FC = () => {
  const Mainboard = (
    <ResizePanel>
      <Paint />
      <FilteredBoard />
    </ResizePanel>
  );

  return (
    <Provider store={store}>
      <ToastProvider>
        <Skeleton board={Mainboard} side={<ConnectedPanel />} />
      </ToastProvider>
    </Provider>
  );
};

export default App;
