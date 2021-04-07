import {
  UPDATE_SELLER_PROFILE
} from "../actions/sellerProfile-actions";
import localStorage from 'local-storage';
import { checkIsNeedPersist, checkNeedPersist, getPersistObj, persistRedux } from '../config';
import _ from 'lodash'

const INITIAL_STATE = {
  // company: {},
  seller: {},
  carOnSales: [],
}

const appReducer = (state = INITIAL_STATE, action) => {


  // checkNeedPersist(_.get(action, 'type'), 'sellerProfile', _.get(action, 'payload'), _.get(action, 'isRestoreData'));

  let persistStates = _.get(localStorage.get('redux') || {}, 'sellerProfile') || INITIAL_STATE;
  state = {
    ...state,
    ...persistStates,
  }
  switch (action.type) {
    case UPDATE_SELLER_PROFILE:
      // state = {...state, company: action.data };
      state = { ...state, seller: action.data };
      break;
    default:
      state = state;
      break;
  }
  persistRedux('sellerProfile', state)
  return state;
};

export default appReducer;
