import {
  ADD_LIKE,
  REMOVE_LIKE,
  ADD_BOOKMARK,
  REMOVE_BOOKMARK,
  ADD_LIKE_MSG,
  REMOVE_LIKE_MSG,
} from '../actions/userlikes-actions';
import _ from "lodash"
import localStorage from 'local-storage';
import { checkIsNeedPersist, checkNeedPersist, getPersistObj, persistRedux } from '../config';

const INITIAL_STATE = {
  allLike: [],
  allBookmark: [],
  allLikeMsg: [],
}


export default function (state = INITIAL_STATE, action) {


  // checkNeedPersist(_.get(action, 'type'), 'userlikes', _.get(action, 'payload'), _.get(action, 'isRestoreData'));

  let persistStates = _.get(localStorage.get('redux') || {}, 'userlikes') || INITIAL_STATE;
  state = {
    ...state,
    ...persistStates,
  }
  if (typeof state === 'undefined') {
    state = {}
  }

  switch (action.type) {

    case ADD_LIKE:
      if (!state.allLike) { state.allLike = [] }
      state.allLike.push(action.value)
      state = {
        ...state,
      }
      break;
    case REMOVE_LIKE:
      _.remove(state.allLike, {
        chatId: action.value.chatId,
        userId: action.value.userId
      });
      state = {
        ...state,
      }
      break;

    case ADD_BOOKMARK:
      if (!state.allBookmark) { state.allBookmark = [] }

      state.allBookmark.push(action.value)
      state = {
        ...state,
      }
      break;
    case REMOVE_BOOKMARK:
      _.remove(state.allBookmark, {
        chatId: action.value.chatId,
        userId: action.value.userId
      });
      state = {
        ...state,
      }
      break;

    case ADD_LIKE_MSG:
      if (!state.allLikeMsg) { state.allLikeMsg = [] }
      state.allLikeMsg.push(action.value)
      state = {
        ...state,
      }
      break;
    case REMOVE_LIKE_MSG:
      _.remove(state.allLikeMsg, {
        chatId: action.value.chatId,
        messageId: action.value.chatId,
        userId: action.value.userId
      });
      state = {
        ...state,
      }

      break;
    default:
      state = state
      break;
  }
  persistRedux('userlikes', state)
  return state;
}
