import _, { upperFirst } from 'lodash'
import moment from 'moment'
import { FETCH_REVISION_ANSWERED_QUESTIONS } from '../actions/kpp-actions';
import { isValidNumber } from '../../common-function';
import localStorage from 'local-storage';
import { checkIsNeedPersist, checkNeedPersist, getPersistObj, persistRedux } from '../config';


const INITIAL_STATE = {
    answeredEnRevisionSectionAPaper: [],
    answeredEnRevisionSectionBPaper: [],
    answeredEnRevisionSectionCPaper: [],
    answeredBmRevisionSectionAPaper: [],
    answeredBmRevisionSectionBPaper: [],
    answeredBmRevisionSectionCPaper: [],

}

export default function (state = INITIAL_STATE, action) {

    // checkNeedPersist(_.get(action, 'type'), 'kpp', _.get(action, 'payload'), _.get(action, 'isRestoreData'));

    let persistStates = _.get(localStorage.get('redux') || {}, 'kpp') || INITIAL_STATE;
    let newState = {
        ...state,
        ...persistStates
    }
    if(!_.isEqual(state, newState)){
      state = newState;
    }
    switch (action.type) {
        case FETCH_REVISION_ANSWERED_QUESTIONS:
            if (!action.payload || !isValidNumber(action.payload.group) || !action.payload.language) {
                state = state;
            } else {
                state[`answered${_.upperFirst(action.payload.language)}RevisionSection${String.fromCharCode(65 + parseInt(action.payload.group))}Paper`] = action.payload.data;
                state = {
                    ...state
                };
            }
            break;
        default:
            state = state
            break;
    }
    persistRedux('kpp', state)

    return state;
}