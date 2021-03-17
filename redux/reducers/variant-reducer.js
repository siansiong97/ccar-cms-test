import _ from 'lodash'
import moment from 'moment'
import { FETCH_VARIANT, CLEAR_VARIANT } from '../actions/variant-action';
import localStorage from 'local-storage';
import { checkIsNeedPersist, checkNeedPersist, getPersistObj } from '../config';


const INITIAL_STATE = {
    variant: {},
}

export default function (state = INITIAL_STATE, action) {

    checkNeedPersist(_.get(action, 'type'), 'variant', _.get(action, 'payload'), _.get(action, 'isRestoreData'));

    switch (action.type) {
        case FETCH_VARIANT:
            return {
                ...state,
                variant: action.payload
            }
        case CLEAR_VARIANT:
            return {
                ...state,
                variant: {},
            }

        default:
            return state

    }
}
