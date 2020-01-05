import { Coordinate } from "../../state/model";
import { toCoordinates } from "../size/sizer";
import React from "react";

export const Line = ({
  start,
  end,
  seen,
  size
}: {
  start: Coordinate;
  end: Coordinate;
  seen: Set<Coordinate>;
  size: number;
}) => {
  const seenStart = seen.has(start);
  const seenEnd = seen.has(end);
  const startCoords = toCoordinates(size, start);
  const endCoords = toCoordinates(size, end);
  const boxSize = size / 9 / 4;
  const centerStartX = startCoords[0] - boxSize / 2;
  const centerStartY = startCoords[1] - boxSize / 2;
  const centerEndX = endCoords[0] - boxSize / 2;
  const centerEndY = endCoords[1] - boxSize / 2;
  const startNode = seenStart ? null : (
    <rect
      x={centerStartX}
      y={centerStartY}
      width={boxSize * 0.8}
      height={boxSize * 0.9}
      fill="rgba(174, 214, 157, 0.2)"
      style={{ pointerEvents: "none" }}
    />
  );
  const endNode = seenEnd ? null : (
    <rect
      x={centerEndX}
      y={centerEndY}
      width={boxSize * 0.8}
      height={boxSize * 0.9}
      fill="rgba(245, 240, 129, 0.2)"
      style={{ pointerEvents: "none" }}
    />
  );

  const midPointX = (startCoords[0] + endCoords[0]) / 2;
  const midPointY = (startCoords[1] + endCoords[1]) / 2;
  // const rise = Math.abs(midPointY - endCoords[1]);
  // const run = Math.abs(midPointX - endCoords[0]);
  // const angle = -run / rise;
  return (
    <g>
      <path
        d={`M ${startCoords[0]} ${startCoords[1]} Q ${midPointX} ${midPointY}
        ${endCoords[0]} ${endCoords[1]}`}
        fill="transparent"
        stroke="#0000ffaa"
        style={{ pointerEvents: "none" }}
      />
      {startNode}
      {endNode}
    </g>
  );
};
