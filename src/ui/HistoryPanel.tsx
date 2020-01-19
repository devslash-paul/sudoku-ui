import React from 'react';
import { AppEvent } from '../state/model'

export type HistoryPanelProps = {
    events: Array<AppEvent>
}

export const HistoryPanel = (props: HistoryPanelProps) => {
    return <div>
        {props.events}
    </div>
}