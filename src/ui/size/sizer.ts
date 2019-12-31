import { Coordinate } from "../../state/model";

export const getSmallCoordinatesFromXY = (
  size: number,
  x: number,
  y: number
): Coordinate => {
  const cell = size / 9;
  const subcell = cell / 3;
  const xAccrossCell = Math.floor(x / cell);
  const yAccrossCell = Math.floor(y / cell);
  const finalCell = yAccrossCell * 9 + xAccrossCell;

  const xAccrossSubCell = Math.floor((x / subcell) % 3);
  const yAccrossSubCell = Math.floor((y / subcell) % 3);
  const finalSub = yAccrossSubCell * 3 + xAccrossSubCell;
  return {
    cell: finalCell,
    subcell: finalSub
  };
};

export const toCoordinates = (size: number, coords: Coordinate) => {
    const { cell, subcell } = coords;
    const largeSize = size/9;
    const smallSize = largeSize/3;
    // to find out the X we need the cell mod 9
    let xAccross = (cell % 9) * largeSize
    xAccross += (subcell % 3) * smallSize + (smallSize /2)
    let yAccross = Math.floor(cell / 9) * largeSize
    yAccross += Math.floor(subcell / 3) * smallSize + (smallSize/2);
    return [xAccross,yAccross]
}