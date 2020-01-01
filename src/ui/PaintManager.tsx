import React from 'react';
import { Paint } from './Painter';
import { connect } from 'react-redux';
import { AppState, State, Coordinate, Link } from '../state/model';


export type Paint = {
    cell: number;
    subcell: number;
    color_start: string;
    color_end: string;
    color_line: string;
}

export type PaintManagerProps = {
    committed: Array<Link>;
    size: number;
    enabled: boolean;
    underway: Coordinate | null;
}

export const PaintManager = (props: PaintManagerProps) => {
    const { enabled, underway, committed } = props;
    if(!enabled) {
        return <></>
    }
    const painter = <Paint underway={underway} lines={committed} />
    return <div>
        {painter}
    </div>
}

const mapStateToProps = (state: AppState) => (
    {
        enabled: state.settings.state === State.PAINTING,
        size: state.settings.boardSize,
        committed: state.paintState.links,
        underway: state.paintState.paintStart
    }
)

export const ConnectedPainter = connect(mapStateToProps)(PaintManager)
