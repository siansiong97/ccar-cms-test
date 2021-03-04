import {
    STEPS_PROPS_CURRENT,
    FORM_ONE
} from '../actions/register-actions';
import localStorage from 'local-storage';
import { checkIsNeedPersist, getPersistObj } from '../config';
import _ from 'lodash';

const INITIAL_STATE = {
    current: 0,
    formOne: {},
}

const appReducer = (state = INITIAL_STATE, action) => {

  let needPersist = checkIsNeedPersist(_.get(action, ['type']));

  if (needPersist) {
    let persistObj = getPersistObj(_.get(action, ['type']));
    let persistData = {
      data : action.payload,
      reducer: 'register',
      createdAt: new Date(),
    }
    localStorage.set(_.get(persistObj, ['action']), persistData);
  }
    switch (action.type) {
        case STEPS_PROPS_CURRENT:
            return {...state, current: action.data };
        case FORM_ONE:
            return {...state, formOne: action.data };
        default:
            return state;
    }
};

export default appReducer;
