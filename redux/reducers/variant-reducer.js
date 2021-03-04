import _ from 'lodash'
import moment from 'moment'
import { FETCH_VARIANT, CLEAR_VARIANT } from '../actions/variant-action';
import localStorage from 'local-storage';
import { checkIsNeedPersist, getPersistObj } from '../config';


const INITIAL_STATE = {
    variant: {},
}

export default function (state = INITIAL_STATE, action) {

    let needPersist = checkIsNeedPersist(_.get(action, ['type']));
  
    if (needPersist) {
      let persistObj = getPersistObj(_.get(action, ['type']));
      let persistData = {
        data : action.payload,
        reducer: 'variant',
        createdAt: new Date(),
      }
      localStorage.set(_.get(persistObj, ['action']), persistData);
    }
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
