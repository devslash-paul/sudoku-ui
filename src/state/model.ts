export type CellState = {
    mainNum: number | null,
    small: Array<number>
}

export type Settings = {
    frozen: boolean,
    enableHighlight: boolean,
    boardSize: number
}

export type AppState = {
    cells: Array<CellState>,
    selectedCell: Array<number>,
    selectedNumbers: Array<number>,
    settings: Settings,
}