import { UPDATE_SOCKET_INFO, DELETE_SOCKET_INFO } from '../actions/socketRefresh-actions';
import localStorage from 'local-storage';
import { checkIsNeedPersist, checkNeedPersist, getPersistObj, persistRedux } from '../config';
import _ from 'lodash'

const INITIAL_STATE = {
};


export default function (state = INITIAL_STATE, action) {

  // checkNeedPersist(_.get(action, 'type'), 'socketRefresh', _.get(action, 'payload'), _.get(action, 'isRestoreData'));

  let persistStates = _.get(localStorage.get('redux') || {}, 'socketRefresh') || INITIAL_STATE;
  state = {
    ...state,
    ...persistStates,
  }
  switch (action.type) {
    case UPDATE_SOCKET_INFO:
      state = action.payload;
    // state = {
    //   ...state,
    //   shouldRefresh: action.payload
    // }
    //not really used we can just update with falsh
      break;
    case DELETE_SOCKET_INFO:
      state = {
        ...state
      };
      break;
    default:
      state = state;
      break;
  }
  persistRedux('socketRefresh', state)
  return state;
}
