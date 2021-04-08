import _ from 'lodash'
import moment from 'moment'
import { FETCH_VARIANT, CLEAR_VARIANT } from '../actions/variant-action';
import localStorage from 'local-storage';
import { checkIsNeedPersist, checkNeedPersist, getPersistObj, persistRedux } from '../config';


const INITIAL_STATE = {
    variant: {},
}

export default function (state = INITIAL_STATE, action) {

    // checkNeedPersist(_.get(action, 'type'), 'variant', _.get(action, 'payload'), _.get(action, 'isRestoreData'));

    let persistStates = _.get(localStorage.get('redux') || {}, 'variant') || INITIAL_STATE;
    let newState = {
        ...state,
        ...persistStates
    }
    if(!_.isEqual(state, newState)){
      state = newState;
    }
    switch (action.type) {
        case FETCH_VARIANT:
            state = {
                ...state,
                variant: action.payload
            }
            break;
        case CLEAR_VARIANT:
            state = {
                ...state,
                variant: {},
            }
            break;

        default:
            state = state
            break;

    }
    persistRedux('variant', state)

    return state;
}
