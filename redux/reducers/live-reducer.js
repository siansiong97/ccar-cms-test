import _, { upperFirst } from 'lodash'
import moment from 'moment'
import { FETCH_CLIENT_SOCKET_IO, CLEAR_CLIENT_SOCKET_IO } from '../actions/live-action';
import localStorage from 'local-storage';
import { checkIsNeedPersist, checkNeedPersist, getPersistObj } from '../config';

const INITIAL_STATE = {
    socket: undefined,
}

export default function (state = INITIAL_STATE, action) {

    checkNeedPersist(_.get(action, 'type'), 'live', _.get(action, 'payload'), _.get(action, 'isRestoreData'));
    
    switch (action.type) {
        case FETCH_CLIENT_SOCKET_IO:
            return {
                ...state,
                socket: action.payload
            }
        case CLEAR_CLIENT_SOCKET_IO:
            return {
                ...state,
                socket: undefined
            }
        default:
            return state
    }
}