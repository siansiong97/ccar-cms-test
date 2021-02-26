import _, { upperFirst } from 'lodash'
import moment from 'moment'
import { FETCH_REVISION_ANSWERED_QUESTIONS } from '../actions/kpp-actions';
import { isValidNumber } from '../../common-function';
import Cookie from 'js-cookie';
import { checkIsNeedPersist, getPersistObj } from '../config';


const INITIAL_STATE = {
    answeredEnRevisionSectionAPaper: [],
    answeredEnRevisionSectionBPaper: [],
    answeredEnRevisionSectionCPaper: [],
    answeredBmRevisionSectionAPaper: [],
    answeredBmRevisionSectionBPaper: [],
    answeredBmRevisionSectionCPaper: [],

}

export default function (state = INITIAL_STATE, action) {
    let needPersist = checkIsNeedPersist(_.get(action, ['type']));
  
    if (needPersist) {
      let persistObj = getPersistObj(_.get(action, ['type']));
      let persistData = {
        data : action.payload,
        reducer: 'kpp',
        createdAt: new Date(),
      }
      Cookie.set(_.get(persistObj, ['action']), JSON.stringify(persistData));
    }

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