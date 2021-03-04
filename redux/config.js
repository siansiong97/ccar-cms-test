

import { LOGIN_SUCCESSFUL, LOGOUT_SUCCESSFUL, loginSuccessful, logoutSuccessful, SET_USER } from './actions/user-actions';
import _ from 'lodash';
import { FETCH_COMPARE_LIMIT, FETCH_PRODUCTSLIST_HOME, ADD_COMPARE__PRODUCT_ID, PATCH_COMPARE_PRODUCT_IDS, CLEAR_COMPARE_PRODUCT_IDS, REMOVE_COMPARE_PRODUCT_ID } from './actions/productsList-actions';
import localStorage from 'local-storage';

export const statePersistActions = [
  {
    action: LOGIN_SUCCESSFUL,
  },
  {
    action: LOGOUT_SUCCESSFUL,
  },
  {
    action: SET_USER,
  },
  {
    action: FETCH_COMPARE_LIMIT,
  },
  {
    action : ADD_COMPARE__PRODUCT_ID,
  },
  {
    action : PATCH_COMPARE_PRODUCT_IDS,
  },
  {
    action : CLEAR_COMPARE_PRODUCT_IDS,
  },
  {
    action : REMOVE_COMPARE_PRODUCT_ID,
  },
];

export function checkIsNeedPersist(action) {
  if (action) {
    return _.some(statePersistActions || [] || [], ['action', action]) || false;
  }

  return false;
}

export function getPersistObj(action) {
  if (action) {
    return _.find(statePersistActions || [], ['action', action]) || {};
  }

  return false;
}

export function getLocalStoragePersistStates() {
  

  let cookiePersistStates = [];
  _.forEach(statePersistActions, function (statePersistAction) {
    let data = localStorage.get([statePersistAction['action']]);
      if (data) {
          try {
              cookiePersistStates.push({
                  persistObj: statePersistAction,
                  data: _.get(data, ['data']),
                  reducer: _.get(data, ['reducer']),
                  createdAt: new Date(_.get(data, ['createdAt'])).getTime(),
              })
          } catch (error) {

          }
      }
  })

  cookiePersistStates = _.sortBy(cookiePersistStates, ['reducer', 'createdAt']);
  return cookiePersistStates || [];

}

export function dynamicDispatch(action, data) {
  return (dispatch) => {
    dispatch({
      type: action,
      payload: data
    });
  }
}