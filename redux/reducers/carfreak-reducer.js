
import moment from 'moment'
import { SET_POST_MODAL_LIKE_REFRESH_ID, FETCH_CAR_FREAK_POSTS, FETCH_EDITED_POST } from '../actions/carfreak.action';
import localStorage from 'local-storage';
import { checkIsNeedPersist, checkNeedPersist, getPersistObj } from '../config';
import _ from 'lodash';

const INITIAL_STATE = {
    postModalLikeRefreshId: '',
    carFreakPosts: [],
    editedPost: {},
}

export default function (state = INITIAL_STATE, action) {

    checkNeedPersist(_.get(action, 'type'), 'carfreak', _.get(action, 'payload'), _.get(action, 'isRestoreData'));

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