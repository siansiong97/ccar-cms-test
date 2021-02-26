import _ from 'lodash'
import moment from 'moment'
import { FETCH_CARPLATESLIST } from '../actions/carPlatesList-actions';
import Cookie from 'js-cookie';
import { checkIsNeedPersist, getPersistObj } from '../config';

const INITIAL_STATE = {
    carPlatesList: []
}

export default function (state = INITIAL_STATE, action) {

    let needPersist = checkIsNeedPersist(_.get(action, ['type']));
  
    if (needPersist) {
      let persistObj = getPersistObj(_.get(action, ['type']));
      let persistData = {
        data : action.payload,
        reducer: 'carPlatesList',
        createdAt: new Date(),
      }
      Cookie.set(_.get(persistObj, ['action']), JSON.stringify(persistData));
    }
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