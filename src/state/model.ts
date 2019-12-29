export type CellState = {
    mainNum: number | null,
    small: Array<number>
}

export type Settings = {
    enableHighlight: boolean
}

export type AppState = {
    cells: Array<CellState>,
    selectedCell: Array<number>,
    selectedNumbers: Array<number>,
    settings: Settings,
}