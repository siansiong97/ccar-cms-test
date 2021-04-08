import _, { upperFirst } from 'lodash'
import moment from 'moment'
import { FETCH_CLIENT_SOCKET_IO, CLEAR_CLIENT_SOCKET_IO } from '../actions/live-action';
import localStorage from 'local-storage';
import { checkIsNeedPersist, checkNeedPersist, getPersistObj, persistRedux } from '../config';

const INITIAL_STATE = {
    socket: undefined,
}

export default function (state = INITIAL_STATE, action) {

    // checkNeedPersist(_.get(action, 'type'), 'live', _.get(action, 'payload'), _.get(action, 'isRestoreData'));

    let persistStates = _.get(localStorage.get('redux') || {}, 'live') || INITIAL_STATE;
    let newState = {
        ...state,
        ...persistStates
    }
    if(!_.isEqual(state, newState)){
      state = newState;
    }
    switch (action.type) {
        case FETCH_CLIENT_SOCKET_IO:
            state = {
                ...state,
                socket: action.payload
            }
            break;
        case CLEAR_CLIENT_SOCKET_IO:
            state = {
                ...state,
                socket: undefined
            }
            break;
        default:
            state = state
            break;
    }
    persistRedux('live', state)

    return state;
}