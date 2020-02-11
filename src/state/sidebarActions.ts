import { SidebarEvent, HighlightChangeEvent, ImportEvent, PaintEvent, ClearHistoryEvent } from "./cellActions";
import { SIDEBAR, NEW, HIGHLIGHT_CHANGE, IMPORT, BEGIN_PAINTING, END_PAINTING, PAINT, CLEAR_HISTORY } from "./actionTypes";

export function onNew() :SidebarEvent{
    return {
        type: SIDEBAR, 
        subtype: NEW,
    }
}

export function onSetHighlight(value: boolean): HighlightChangeEvent {
    return {
        type: HIGHLIGHT_CHANGE,
        value,
    }
}

export function onImport(value: string): ImportEvent {
    return {
        type: IMPORT,
        value
    }
}

export function onChangePainting(value: boolean): PaintEvent {
    return {
        type: PAINT,
        subtype: value ? BEGIN_PAINTING: END_PAINTING,
    }
}
export function clearEvents(): ClearHistoryEvent {
    return {
        type: CLEAR_HISTORY,
    }
}