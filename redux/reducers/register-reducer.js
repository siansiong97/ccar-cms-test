import {
  STEPS_PROPS_CURRENT,
  FORM_ONE
} from '../actions/register-actions';
import localStorage from 'local-storage';
import { checkIsNeedPersist, checkNeedPersist, getPersistObj, persistRedux } from '../config';
import _ from 'lodash';

const INITIAL_STATE = {
  current: 0,
  formOne: {},
}

const appReducer = (state = INITIAL_STATE, action) => {


  // checkNeedPersist(_.get(action, 'type'), 'register', _.get(action, 'payload'), _.get(action, 'isRestoreData'));

  let persistStates = _.get(localStorage.get('redux') || {}, 'productsList') || INITIAL_STATE;
  state = {
    ...state,
    ...persistStates,
  }
  switch (action.type) {
    case STEPS_PROPS_CURRENT:
      state = { ...state, current: action.data };
      break;
    case FORM_ONE:
      state = { ...state, formOne: action.data };
      break;
    default:
      state = state;
      break;
  }
  persistRedux('register', state)
  return state;
};

export default appReducer;
