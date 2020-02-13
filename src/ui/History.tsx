import { connect } from "react-redux";
import { HistoryPanel } from './HistoryPanel'
import { AppState } from "../state/model";

const mapStateToProps = (state: AppState) => {
    return {
        events: [...state.history.items].reverse()
    }
}

export const History = connect(mapStateToProps)(HistoryPanel)