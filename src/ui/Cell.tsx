import React, { Component } from "react";
import CSS from "csstype";

type CellProps = {
  number: number | null;
  small: Array<number>;
  cells: number;
  selected: boolean;
  focused: boolean;
  highlight: number | null;
  size: number;
  onClick: (meta: boolean) => void;
  onClickText: (number: number) => void;
  onInput: (arg0: number, shift: boolean, meta: boolean) => void;
  onBlur: () => void;
  onMouseover: () => void;
};

const style: CSS.Properties = {
  color: "black",
  boxSizing: "border-box",
  textAlign: "center",
  background: "white",
};
const highlightText: CSS.Properties = {
  color: "red",
  fontWeight: "bold"
  // background: "yellow"
};

export class Cell extends Component<CellProps> {
  shouldComponentUpdate(nextProps: CellProps): boolean {
    return (
      this.props.number !== nextProps.number ||
      this.props.selected !== nextProps.selected ||
      this.props.small !== nextProps.small ||
      this.props.size !== nextProps.size ||
      this.props.highlight !== nextProps.highlight
    );
  }

  onMouseover = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.buttons && 0x1) {
      this.props.onMouseover();
    }
  };

  render() {
    const ninth = this.props.size;
    const extraStyle: CSS.Properties = {
      ...style,
      flexBasis: "calc(100%/" + this.props.cells + ")",
      fontSize: `${ninth - 10}px`,
      height: `${ninth}px`,
      lineHeight: `${ninth}px`,
      position: "relative",
      padding: '2px',
      justifyItems: 'center',
      alignItems: 'center',
      background: this.props.selected ? "rgba(0,0,255,0.2)" : "white"
    };

    const inside = this.props.number
      ? this.getLargeCell()
      : this.getSmallCell();

    const tryStyle: CSS.Properties = {
      ...extraStyle,
      display: 'grid',
      gridTemplateColumns: '33% 34% 33%',
      gridTemplateRows: '33% 34% 33%',
    }

    return (
      <div
        tabIndex={0}
        style={tryStyle}
        className="tile"

        onMouseDown={e => this.props.onClick(e.shiftKey)}
        onKeyDown={e => this.props.onInput(e.keyCode, e.shiftKey, e.metaKey)}
        onMouseMove={this.onMouseover}
        onBlur={this.props.onBlur}
      >
        {inside}
      </div>
    );
  }

  private getSmallCell() {
    return this.props.small.map(x => {
      const clickHandler = () => this.props.onClickText(x);
      const thirdSize = Math.floor(this.props.size / 4);
      let s: React.CSSProperties = {
        fontSize: `${thirdSize}px`,
        height: `${thirdSize}px`,
        lineHeight: `${thirdSize}px`,
        gridRow: `${Math.floor((x-1)/3) + 1}`,
        gridColumn: ((x-1)%3) + 1,
      };
      if (this.props.highlight === x) {
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
    const highlight = this.props.highlight === this.props.number;
    const style = highlight ? highlightText : {};
    const ex = {
      ...style,
      gridRow: '1/4',
      gridColumn: '1/4',
    }
    return (
      <div className="content" onClick={clickHandler} style={ex}>
        {this.props.number}
      </div>
    );
  }
}
