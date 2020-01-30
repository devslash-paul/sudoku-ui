import { AppEvent } from "./model";

export const collapseHistory = (events: Array<AppEvent>) => {
    let last: AppEvent | null = null;
    let res: Array<AppEvent> = [];
    if (events.length == 0) {
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