

import { LOGIN_SUCCESSFUL, LOGOUT_SUCCESSFUL, loginSuccessful, logoutSuccessful, SET_USER } from './actions/user-actions';
import _ from 'lodash';
import { FETCH_COMPARE_LIMIT, FETCH_PRODUCTSLIST_HOME, ADD_COMPARE__PRODUCT_ID, PATCH_COMPARE_PRODUCT_IDS, CLEAR_COMPARE_PRODUCT_IDS, REMOVE_COMPARE_PRODUCT_ID } from './actions/productsList-actions';
import localStorage from 'local-storage';
import { FETCH_CLIENT_SOCKET_IO, CLEAR_CLIENT_SOCKET_IO } from './actions/live-action';
import { UPDATE_SOCKET_INFO, DELETE_SOCKET_INFO } from './actions/socketRefresh-actions';
import moment from 'moment';
import { isValidNumber } from '../common-function';

//Not supported for multiple same action update yet
//Ex. ADD_COMPARE__PRODUCT_ID for twice, i will only take the last 1. Same actions before last one will be ignored;
export const statePersistActions = [
  {
    action: LOGIN_SUCCESSFUL,
    reducer: 'user',
  },
  {
    action: LOGOUT_SUCCESSFUL,
    reducer: 'user',
  },
  {
    action: SET_USER,
    reducer: 'user',
  },
  {
    action: FETCH_COMPARE_LIMIT,
    reducer: 'productsList',
  },
  // {
  //   action : ADD_COMPARE__PRODUCT_ID,
  // reducer : 'productList',
  // },
  {
    action: PATCH_COMPARE_PRODUCT_IDS,
    reducer: 'productsList',
  },
  {
    action: CLEAR_COMPARE_PRODUCT_IDS,
    reducer: 'productsList',
  },
  {
    action: REMOVE_COMPARE_PRODUCT_ID,
    reducer: 'productsList',
  },
  {
    action: FETCH_CLIENT_SOCKET_IO,
    reducer: 'socketRefresh',
  },
  {
    action: CLEAR_CLIENT_SOCKET_IO,
    reducer: 'socketRefresh',
  },
  {
    action: UPDATE_SOCKET_INFO,
    reducer: 'socketRefresh',
  },
  {
    action: DELETE_SOCKET_INFO,
    reducer: 'socketRefresh',
  },
];

export function persistRedux(reducer, data) {

  if (reducer && _.isPlainObject(data) && !_.isEmpty(data)) {
    let reduxStates = localStorage.get('redux');
    if (!_.isPlainObject(reduxStates)) {
      reduxStates = {};
    }

    reduxStates[reducer] = data;
    localStorage.set('redux', reduxStates);
  }
}

export function checkIsNeedPersist(action) {
  if (action) {
    return _.some(statePersistActions || [] || [], ['action', action]) || false;
  }

  return false;
}

export function checkNeedPersist(action, reducer, data, isRestoreData) {
  let needPersist = checkIsNeedPersist(action);
  let persistObj = getPersistObj(action);

  if (needPersist && _.get(persistObj, 'reducer') == reducer) {
    let persistedStates = getLocalStoragePersistStates(_.get(persistObj, 'reducer'));
    let selectedPersistedState = _.find(persistedStates, {
      persistObj: {
        action: action
      }
    });
    let sequence = 0;

    if (!isRestoreData || !isValidNumber(_.get(selectedPersistedState, 'sequence'))) {
      sequence = _.get(_.maxBy(persistedStates || [], 'sequence'), 'sequence');
      if (!isValidNumber(sequence)) {
        sequence = 0;
      } else {
        sequence = parseInt(sequence) + 1;
      }
    } else {
      sequence = parseInt(_.get(selectedPersistedState, 'sequence'));
    }


    let persistData = {
      data: data,
      reducer: _.get(persistObj, 'reducer'),
      createdAt: new Date(),
      sequence: sequence,
    }
    localStorage.set(_.get(persistObj, ['action']), persistData);
  }
}

export function getPersistObj(action) {
  if (action) {
    return _.find(statePersistActions || [], ['action', action]) || {};
  }

  return false;
}

export function getLocalStoragePersistStates(reducer) {


  let cookiePersistStates = [];
  _.forEach(statePersistActions, function (statePersistAction) {
    let data = localStorage.get(statePersistAction['action']);
    if (data) {
      if (!reducer || reducer == _.get(data, 'reducer')) {
        try {
          cookiePersistStates.push({
            persistObj: statePersistAction,
            data: _.get(data, ['data']),
            reducer: _.get(data, ['reducer']),
            createdAt: moment(_.get(data, ['createdAt'])),
            sequence: _.get(data, ['sequence']) || 0,
          })
        } catch (error) {

        }
      }
    }
  })
  cookiePersistStates = _.sortBy(cookiePersistStates, ['reducer', 'sequence']);
  return cookiePersistStates || [];

}


export function dynamicDispatch(action, data) {
  return (dispatch) => {
    dispatch({
      type: action,
      payload: data,
      isRestoreData: true,
    });
  }
}

export const RESTORE_REDUX = 'RESTORE_REDUX';
export function restoreRedux(data) {
  return (dispatch) => {
    dispatch({
      type: RESTORE_REDUX,
      payload: data,
    });
  }
}