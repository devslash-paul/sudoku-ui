import { SidebarEvent, HighlightChangeEvent, ImportEvent } from "./cellActions";
import { SIDEBAR, NEW, HIGHLIGHT_CHANGE, IMPORT } from "./actionTypes";

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