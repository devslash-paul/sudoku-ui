import React, { Dispatch, SyntheticEvent } from "react";
import { AppState } from "../state/model";
import { connect } from "react-redux";
import { Actions, resize } from "../state/cellActions";
import { ResizableBox, ResizeCallbackData } from "react-resizable";
import { RESIZE_START, RESIZE_END } from "../state/actionTypes";

type ResizePanelProps = {
  size: number;
  children: Array<JSX.Element>;
  onDrag: (arg0: SyntheticEvent, data: ResizeCallbackData) => void;
  onDragStart: (arg0: SyntheticEvent, data: ResizeCallbackData) => void;
  onDragEnd: (arg0: SyntheticEvent, data: ResizeCallbackData) => void;
};

function ResizePanelUI(props: ResizePanelProps): JSX.Element {
  return (
    <ResizableBox
      width={props.size}
      height={props.size}
      minConstraints={[450, 450]}
      lockAspectRatio={true}
      onResize={props.onDrag}
      onResizeStart={props.onDragStart}
      onResizeStop={props.onDragEnd}
    >
      {props.children}
    </ResizableBox>
  );
}

const mapStateToProps = (main: AppState) => {
  return {
    size: main.settings.boardSize
  };
};

const mapDispatchToProps = (dispatch: Dispatch<Actions>) => {
    return {
        onDrag: (e: SyntheticEvent, data: ResizeCallbackData) => {
            dispatch(resize(data.size.width))
        },
        onDragStart: (e: SyntheticEvent, data: ResizeCallbackData) => {
            dispatch({
                type: RESIZE_START
            })
        },
        onDragEnd: (e: SyntheticEvent, data: ResizeCallbackData) => {
            dispatch({
                type: RESIZE_END
            })
        }
    }
}

export const ResizePanel = connect(mapStateToProps, mapDispatchToProps)(ResizePanelUI);
