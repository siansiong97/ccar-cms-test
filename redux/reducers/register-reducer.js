import {
  STEPS_PROPS_CURRENT,
  FORM_ONE
} from '../actions/register-actions';
import localStorage from 'local-storage';
import { checkIsNeedPersist, checkNeedPersist, getPersistObj } from '../config';
import _ from 'lodash';

const INITIAL_STATE = {
  current: 0,
  formOne: {},
}

const appReducer = (state = INITIAL_STATE, action) => {


  checkNeedPersist(_.get(action, 'type'), 'register', _.get(action, 'payload'), _.get(action, 'isRestoreData'));

  switch (action.type) {
    case STEPS_PROPS_CURRENT:
      return { ...state, current: action.data };
    case FORM_ONE:
      return { ...state, formOne: action.data };
    default:
      return state;
  }
};

export default appReducer;
