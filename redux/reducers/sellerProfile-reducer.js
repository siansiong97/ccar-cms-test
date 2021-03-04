import { 
    UPDATE_SELLER_PROFILE
 } from "../actions/sellerProfile-actions";
 import localStorage from 'local-storage';
 import { checkIsNeedPersist, getPersistObj } from '../config';
 import _ from 'lodash'

const INITIAL_STATE = {
    // company: {},
    seller: {},
    carOnSales : [],
}

const appReducer = (state = INITIAL_STATE, action) => {

  let needPersist = checkIsNeedPersist(_.get(action, ['type']));

  if (needPersist) {
    let persistObj = getPersistObj(_.get(action, ['type']));
    let persistData = {
      data : action.payload,
      reducer: 'sellerProfile',
      createdAt: new Date(),
    }
    localStorage.set(_.get(persistObj, ['action']), persistData);
  }
    switch (action.type) {
        case UPDATE_SELLER_PROFILE:
            // return {...state, company: action.data };
            return {...state, seller: action.data };
        default:
            return state;
    }
};

export default appReducer;
