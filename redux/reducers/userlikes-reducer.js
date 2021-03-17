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
import { checkIsNeedPersist, checkNeedPersist, getPersistObj } from '../config';

const INITIAL_STATE = {
  allLike: [],
  allBookmark: [],
  allLikeMsg:[],
}


export default function (state = INITIAL_STATE, action) {

 
  checkNeedPersist(_.get(action, 'type'), 'userlikes', _.get(action, 'payload'), _.get(action, 'isRestoreData'));
  
  if (typeof state === 'undefined') {
    return {}
  }

  switch (action.type) {

    case ADD_LIKE:
      if(!state.allLike){state.allLike=[]}
      state.allLike.push(action.value)
      return {
        ...state,
      }
    case REMOVE_LIKE:
      _.remove(state.allLike, {
        chatId: action.value.chatId,
        userId: action.value.userId
      });
      return {
        ...state,
      }

      case ADD_BOOKMARK:
        if(!state.allBookmark){state.allBookmark=[]}
        
        state.allBookmark.push(action.value)
        return {
          ...state,
        }
      case REMOVE_BOOKMARK:
        _.remove(state.allBookmark, {
          chatId: action.value.chatId,
          userId: action.value.userId
        });
        return {
          ...state,
        }

        case ADD_LIKE_MSG:
          if(!state.allLikeMsg){state.allLikeMsg=[]}
          state.allLikeMsg.push(action.value)
          return {
            ...state,
          }
        case REMOVE_LIKE_MSG:
          _.remove(state.allLikeMsg, {
            chatId: action.value.chatId,
            messageId: action.value.chatId,
            userId: action.value.userId
          });
          return {
            ...state,
          }

    default:
      return state
  }
}
