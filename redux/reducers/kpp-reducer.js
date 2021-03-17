import _, { upperFirst } from 'lodash'
import moment from 'moment'
import { FETCH_REVISION_ANSWERED_QUESTIONS } from '../actions/kpp-actions';
import { isValidNumber } from '../../common-function';
import localStorage from 'local-storage';
import { checkIsNeedPersist, checkNeedPersist, getPersistObj } from '../config';


const INITIAL_STATE = {
    answeredEnRevisionSectionAPaper: [],
    answeredEnRevisionSectionBPaper: [],
    answeredEnRevisionSectionCPaper: [],
    answeredBmRevisionSectionAPaper: [],
    answeredBmRevisionSectionBPaper: [],
    answeredBmRevisionSectionCPaper: [],

}

export default function (state = INITIAL_STATE, action) {

    checkNeedPersist(_.get(action, 'type'), 'kpp', _.get(action, 'payload'), _.get(action, 'isRestoreData'));

    switch (action.type) {
        case FETCH_REVISION_ANSWERED_QUESTIONS:
            if (!action.payload || !isValidNumber(action.payload.group) || !action.payload.language) {
                return state;
            } else {
                state[`answered${_.upperFirst(action.payload.language)}RevisionSection${String.fromCharCode(65 + parseInt(action.payload.group))}Paper`] = action.payload.data;
                return {
                    ...state
                };
            }
        default:
            return state
    }
}