import {
  UPDATE_SELLER_PROFILE
} from "../actions/sellerProfile-actions";
import localStorage from 'local-storage';
import { checkIsNeedPersist, checkNeedPersist, getPersistObj } from '../config';
import _ from 'lodash'

const INITIAL_STATE = {
  // company: {},
  seller: {},
  carOnSales: [],
}

const appReducer = (state = INITIAL_STATE, action) => {


  checkNeedPersist(_.get(action, 'type'), 'sellerProfile', _.get(action, 'payload'), _.get(action, 'isRestoreData'));

  switch (action.type) {
    case UPDATE_SELLER_PROFILE:
      // return {...state, company: action.data };
      return { ...state, seller: action.data };
    default:
      return state;
  }
};

export default appReducer;
