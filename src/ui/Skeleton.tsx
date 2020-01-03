import React from "react";
import CSS from "csstype";

export type SkeletonProps = {
  board: JSX.Element;
  side: JSX.Element;
};

const bodyStyle: CSS.Properties = {
  display: "flex",
  minHeight: "100%"
  //   justifyContent: 'center'
};

const boardStyle: CSS.Properties = {
  position: "relative",
  padding: "20px"
};

const sidebarStyle = {
  background: "rgb(170, 170, 170)",
  padding: "20px",
  width: "20%",
  minWidth: "250px"
};

export class Skeleton extends React.PureComponent<SkeletonProps> {
  render() {
    return (
      <div style={bodyStyle}>
        <div style={sidebarStyle}>{this.props.side}</div>
        <div style={boardStyle}>{this.props.board}</div>
      </div>
    );
  }
}
