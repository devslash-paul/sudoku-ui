import React from 'react';
import { AppEvent } from '../state/model'
import CSS from 'csstype';
import { Hidden } from '@material-ui/core';

export type HistoryPanelProps = {
    events: Array<AppEvent>
}

const containerStyle: CSS.Properties = {
    height: '145px',
    overflow: 'hidden',
}

const createMessage = (item: AppEvent) => {
    switch (item.kind) {
        case 'ADD': 
            if(item.large) {
                return `Added ${item.large} to cell ${item.index}`
            }
            if(item.small) {
                return `Added ${item.small} as pencil marks to cell ${item.index}`
            }
        case 'REMOVE': 
            if (item.large) {
                return `Removed ${item.large} to cell ${item.index}`
            }
            if(item.small) {
                return `Removed ${item.small} as pencil marks to cell ${item.index}`
            }
    }
}

const EventItem = ({ item }: { item: AppEvent }) => {
    const message = createMessage(item);
    return <div>
        {message}
    </div>
}

export const HistoryPanel = (props: HistoryPanelProps) => {
    const items = props.events.map(x => <EventItem item={x} />)
    return <div style={containerStyle}>
        {items}
    </div>
}