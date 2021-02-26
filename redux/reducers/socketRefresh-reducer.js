import { UPDATE_SOCKET_INFO, DELETE_SOCKET_INFO } from '../actions/socketRefresh-actions';
import Cookie from 'js-cookie';
import { checkIsNeedPersist, getPersistObj } from '../config';
import _ from 'lodash'

const INITIAL_STATE = false;


export default function (state = INITIAL_STATE, action) {

  let needPersist = checkIsNeedPersist(_.get(action, ['type']));

  if (needPersist) {
    let persistObj = getPersistObj(_.get(action, ['type']));
    let persistData = {
      data : action.payload,
      reducer: 'socketRefresh',
      createdAt: new Date(),
    }
    Cookie.set(_.get(persistObj, ['action']), JSON.stringify(persistData));
  }
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
