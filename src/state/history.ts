import { AppEvent } from "./model";

export const collapseHistory = (events: Array<AppEvent>) => {
    let last: AppEvent | null = null;
    let res: Array<AppEvent> = [];
    if (events.length === 0) {
        return [];
    }

    for (let i = 0; i < events.length; i++) {
        if (last === null) {
            last = events[i]
            continue
        }
        let cur = events[i]
        if (last.kind === cur.kind && JSON.stringify(last.small) === JSON.stringify(cur.small)) {
            last = {
                ...last,
                index: [...last.index, ...cur.index]
            }
        } else {
            res.push(last)
            last = cur;
        }
    }
    if (last !== null) {
        res.push(last)
    }
    return res;
}

export const collapseUndo = (events: Array<AppEvent>) => {
    // this can only happen on the last two
    if (events.length < 2) {
        return events;
    }

    var last = events[events.length - 1]
    var snd = events[events.length - 2]

    if ((last.kind === "ADD" && snd.kind === "REMOVE") ||
        (last.kind === "REMOVE" && snd.kind === "ADD")) {
        if (last.large === snd.large && JSON.stringify(last.small) === JSON.stringify(snd.small)
            && JSON.stringify(last.index) === JSON.stringify(snd.index)) {
            // they're an undo of the other
            return events.slice(0, events.length - 2)
        }
    }
    return events
}