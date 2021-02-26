import _, { upperFirst } from 'lodash'
import moment from 'moment'
import { FETCH_CLIENT_SOCKET_IO, CLEAR_CLIENT_SOCKET_IO } from '../actions/live-action';
import Cookie from 'js-cookie';
import { checkIsNeedPersist, getPersistObj } from '../config';

const INITIAL_STATE = {
    socket: undefined,
}

export default function (state = INITIAL_STATE, action) {

  let needPersist = checkIsNeedPersist(_.get(action, ['type']));

  if (needPersist) {
    let persistObj = getPersistObj(_.get(action, ['type']));
    let persistData = {
      data : action.payload,
      reducer: 'live',
      createdAt: new Date(),
    }
    Cookie.set(_.get(persistObj, ['action']), JSON.stringify(persistData));
  }
    switch (action.type) {
        case FETCH_CLIENT_SOCKET_IO:
            return {
                ...state,
                socket: action.payload
            }
        case CLEAR_CLIENT_SOCKET_IO:
            return {
                ...state,
                socket: undefined
            }
        default:
            return state
    }
}