import { UPDATE_SOCKET_INFO, DELETE_SOCKET_INFO } from '../actions/socketRefresh-actions';
import localStorage from 'local-storage';
import { checkIsNeedPersist, checkNeedPersist, getPersistObj } from '../config';
import _ from 'lodash'

const INITIAL_STATE = false;


export default function (state = INITIAL_STATE, action) {

  checkNeedPersist(_.get(action, 'type'), 'socketRefresh', _.get(action, 'payload'), _.get(action, 'isRestoreData'));
    
  switch (action.type) {
    case UPDATE_SOCKET_INFO:
      return action.payload;
      // return {
      //   ...state,
      //   shouldRefresh: action.payload
      // }
    //not really used we can just update with falsh
    case DELETE_SOCKET_INFO:
      return {
        ...state
      };
    default:
      return state;
  }
}
