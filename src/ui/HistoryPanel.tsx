import React, { CSSProperties } from 'react';
import { FixedSizeList as List } from 'react-window';
import ReplayIcon from '@material-ui/icons/Replay';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import { AppEvent } from '../state/model'
import CSS from 'csstype';

export type HistoryPanelProps = {
    events: Array<AppEvent>
}

const containerStyle: CSS.Properties = {
    height: '145px',
    overflowY: 'scroll',
    overflowX: 'hidden',
    background: 'white',
    boxSizing: 'border-box',
}

function convert(num: number[]) {
    // if they're all in a col or a row, we can do some nice things
    // otherwise fall back to long form
    let rows = new Set<number>();
    let cols = new Set<number>();
    let res: Array<string> = []
    num.forEach(n => {
        const row = Math.floor(n / 9) + 1;
        const col = n % 9 + 1;
        rows.add(row)
        cols.add(col)
        res.push(`r${row}c${col}`)
    })
    if (rows.size === 1) {
        // we only added to one row
        const arr = Array.from(cols.values())
            .map(x => "" + x)
            .reduce((p, n) => p + n, "")
        return `r${rows.values().next().value}c${arr}`
    }
    else if (cols.size === 1) {
        // we only added to one row
        const arr = Array.from(rows.values())
            .map(x => "" + x)
            .reduce((p, n) => p + n, "")
        return `r${arr}c${cols.values().next().value}`
    }
    return res
}

const createMessage = (item: AppEvent) => {
    switch (item.kind) {
        case 'ADD':
            if (item.large) {
                return <><AddCircleIcon /> {item.large} to {convert(item.index)}</>
            }
            if (item.small) {
                return <><AddCircleIcon /> {item.small} as pencil marks to cell {convert(item.index)}</>
            }
            break;
        case 'REMOVE':
            if (item.large) {
                return <><RemoveCircleIcon /> {item.large} to cell {convert(item.index)}</>
            }
            if (item.small) {
                return <><RemoveCircleIcon /> {item.small} as pencil marks to cell {convert(item.index)}</>
            }
    }
}

const EventItem = ({ item, style }: { item: AppEvent, style: CSSProperties }) => {
    const message = createMessage(item);
    const def: CSS.Properties = {
        display: 'flex',
        border: '1px solid black',
        alignItems: 'center',
        paddingRight: '5px',
        paddingLeft: '2px',
        borderRadius: '2px',
        boxSizing: 'border-box',
    }
    return <div style={{...def, ...style}}>
        {message}
        <ReplayIcon style={{ marginLeft: 'auto' }} />
    </div>
}

export const HistoryPanel = (props: HistoryPanelProps) => {
    const Row = ({ index, style }: {index: number, style: CSSProperties}) => (
        <EventItem style={style} item={props.events[index]} />
    );
    return <List 
        height={150}
        itemCount={props.events.length}
        itemSize={35}
        width={"100%"}
        style={containerStyle}>
        {Row}
    </List>
}