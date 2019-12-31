export type CellState = {
    mainNum: number | null,
    small: Array<number>
}

export enum State {
    NORMAL=1,
    FROZEN=2,
    PAINTING=3
}

export type Settings = {
    state: State,
    enableHighlight: boolean,
    boardSize: number
}

export type Link = {
    start: Coordinate, 
    end: Coordinate,
}

export type Coordinate = {
    cell: number;
    subcell: number;
}

export type PaintState = {
    links: Array<Link>,
    paintStart: Coordinate | null,
}

export type AppState = {
    cells: Array<CellState>,
    selectedCell: Array<number>,
    selectedNumbers: Array<number>,
    settings: Settings,
    paintState: PaintState,
}