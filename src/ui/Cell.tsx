import React, { Component } from "react";
import CSS from "csstype";

type CellProps = {
  number: number | null;
  small: Array<number>;
  selected: boolean;
  focused: boolean;
  highlight: Array<number>;
  size: number;
  onClick: () => void;
  onClickText: (number: number) => void;
  onInput: (arg0: number, meta: boolean) => void;
  onBlur: () => void;
  onMouseover: () => void;
};

const style: CSS.Properties = {
  color: "black",
  boxSizing: "border-box",
  textAlign: "center",
  background: "white",
  flexBasis: "calc(100% /9)"
};
const highlightText = {
  color: "green",
  background: "yellow"
};

export class Cell extends Component<CellProps> {
  shouldComponentUpdate(nextProps: CellProps): boolean {
    return (
      this.props.number !== nextProps.number ||
      this.props.selected !== nextProps.selected ||
      this.props.small !== nextProps.small ||
      JSON.stringify(this.props.highlight) !== JSON.stringify(nextProps.highlight)
    );
  }

  onMouseover = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.buttons && 0x1) {
      this.props.onMouseover();
    }
  };

  render() {
    const ninth = this.props.size;
    const extraStyle: React.CSSProperties = {
      ...style,
      fontSize: `${ninth - 10}px`,
      height: `${ninth}px`,
      lineHeight: `${ninth}px`,
      position: "relative",
      background: this.props.selected ? "rgba(0,0,255,0.2)" : "white"
    };

    const inside = this.props.number
      ? this.getLargeCell()
      : this.getSmallCell();

    return (
      <div
        tabIndex={0}
        className="tile"
        style={extraStyle}
        onClick={this.props.onClick}
        onKeyDown={e => this.props.onInput(e.keyCode, e.shiftKey)}
        onMouseMove={this.onMouseover}
        onBlur={this.props.onBlur}
      >
        {inside}
      </div>
    );
  }

  private getSmallCell() {
    return this.props.small.map(x => {
      const pos = "absolute";
      const clickHandler = () => this.props.onClickText(x);
      const thirdSize = Math.floor(this.props.size / 4);
      let s: React.CSSProperties = {
        position: pos,
          fontSize: `${thirdSize}px`,
          height: `${thirdSize}px`,
          display: `inline-block`,
          textAlign: `left`,
          lineHeight: `${thirdSize}px`,
        left: ((x - 1) % 3) * (this.props.size / 3) + ((3/50) * this.props.size),
        top: Math.floor((x - 1) / 3) * (this.props.size / 3)
      };
      if (this.props.highlight.indexOf(x) !== -1) {
        s = {
          ...s,
          ...highlightText
        };
      }
      return (
        <div key={x} style={s} className="smallContent" onClick={clickHandler}>
          {x}
        </div>
      );
    });
  }

  private getLargeCell() {
    if (this.props.number == null) {
      throw Error();
    }
    const clickHandler = () =>
      this.props.number && this.props.onClickText(this.props.number);
    const highlight = this.props.highlight.indexOf(this.props.number) !== -1;
    const style = highlight ? highlightText : {};
    return (
      <div className="content" onClick={clickHandler} style={style}>
        {this.props.number}
      </div>
    );
  }
}
