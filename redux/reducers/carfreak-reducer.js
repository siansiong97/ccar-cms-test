
import moment from 'moment'
import { SET_POST_MODAL_LIKE_REFRESH_ID, FETCH_CAR_FREAK_POSTS, FETCH_EDITED_POST } from '../actions/carfreak.action';
import Cookie from 'js-cookie';
import { checkIsNeedPersist, getPersistObj } from '../config';
import _ from 'lodash';

const INITIAL_STATE = {
    postModalLikeRefreshId: '',
    carFreakPosts: [],
    editedPost: {},
}

export default function (state = INITIAL_STATE, action) {

  let needPersist = checkIsNeedPersist(_.get(action, ['type']));

  if (needPersist) {
    let persistObj = getPersistObj(_.get(action, ['type']));
    let persistData = {
      data : action.payload,
      reducer: 'carfreak',
      createdAt: new Date(),
    }
    Cookie.set(_.get(persistObj, ['action']), JSON.stringify(persistData));
  }
    switch (action.type) {
        case SET_POST_MODAL_LIKE_REFRESH_ID:
            return {
                ...state,
                postModalLikeRefreshId: action.payload,
            }
        case FETCH_CAR_FREAK_POSTS:
            return {
                ...state,
                carFreakPosts: action.payload,
            }
        case FETCH_EDITED_POST:
            return {
                ...state,
                editedPost: action.payload,
            }
        default:
            return state
    }
}