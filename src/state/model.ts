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
    a_x: number;
    a_y: number;
    b_x: number;
    b_y: number;
    a_color: string;
    b_color: string;
}

export type PaintState = {
    links: Array<Link>
}

export type AppState = {
    cells: Array<CellState>,
    selectedCell: Array<number>,
    selectedNumbers: Array<number>,
    settings: Settings,
    paintState: PaintState,
}