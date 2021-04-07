import _ from 'lodash'
import moment from 'moment'
import { FETCH_CARPLATESLIST } from '../actions/carPlatesList-actions';
import localStorage from 'local-storage';
import { checkIsNeedPersist, checkNeedPersist, getPersistObj, persistRedux } from '../config';

const INITIAL_STATE = {
    carPlatesList: [],
}

export default function (state = INITIAL_STATE, action) {

    // checkNeedPersist(_.get(action, 'type'), 'carPlatesList', _.get(action, 'payload'), _.get(action, 'isRestoreData'));

    let persistStates = _.get(localStorage.get('redux') || {}, 'carPlatesList') || INITIAL_STATE;
    state = {
      ...state,
      ...persistStates,
    }
    switch (action.type) {
        case FETCH_CARPLATESLIST:
            state = {
                ...state,
                carPlatesList: action.payload
            };
            break;
        default:
            state = state
            break;
    }
    persistRedux('carPlatesList', state)
    return state;
}