import _ from 'lodash'
import moment from 'moment'
import { FETCH_CARPLATESLIST } from '../actions/carPlatesList-actions';
import localStorage from 'local-storage';
import { checkIsNeedPersist, checkNeedPersist, getPersistObj } from '../config';

const INITIAL_STATE = {
    carPlatesList: []
}

export default function (state = INITIAL_STATE, action) {

    checkNeedPersist(_.get(action, 'type'), 'carPlatesList', _.get(action, 'payload'), _.get(action, 'isRestoreData'));

    switch (action.type) {
        case FETCH_CARPLATESLIST:
            return {
                ...state,
                carPlatesList: action.payload
            }
        default:
            return state
    }
}