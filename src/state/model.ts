export type CellState = {
    mainNum: number | null,
    small: Array<number>
}

export enum State {
    NORMAL=1,
    FROZEN=2,
    PAINTING=3
}

/**
 * All events must be reversible, events that are supported are
 * ADD of large number
 * REMOVAL of large number
 * ADDITION of small numbers (one by one)
 * REMOVAL of small numbers (one by one)
 * ADDITION of small numbers (in batch)
 * REMOVAL of small numbers (in batch)
 */
export type AppEvent  ={
    kind: 'ADD' | 'REMOVE',
    index: Array<number>,
    large?: number,
    small?: Array<number>,
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

export type History = {
    items: Array<AppEvent>,
    activeItem: number,
}

export type AppState = {
    cells: Array<CellState>,
    settings: Settings,
    paintState: PaintState,
    history: History,
}