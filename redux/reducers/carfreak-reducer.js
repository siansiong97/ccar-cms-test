
import moment from 'moment'
import { SET_POST_MODAL_LIKE_REFRESH_ID, FETCH_CAR_FREAK_POSTS, FETCH_EDITED_POST } from '../actions/carfreak.action';
import localStorage from 'local-storage';
import { checkIsNeedPersist, checkNeedPersist, getPersistObj, persistRedux } from '../config';
import _ from 'lodash';

const INITIAL_STATE = {
    postModalLikeRefreshId: '',
    carFreakPosts: [],
    editedPost: {},
}

export default function (state = INITIAL_STATE, action) {

    // checkNeedPersist(_.get(action, 'type'), 'carfreak', _.get(action, 'payload'), _.get(action, 'isRestoreData'));

    let persistStates = _.get(localStorage.get('redux') || {}, 'carfreak') || INITIAL_STATE;
    state = {
      ...state,
      ...persistStates,
    }
    switch (action.type) {
        case SET_POST_MODAL_LIKE_REFRESH_ID:
            state = {
                ...state,
                postModalLikeRefreshId: action.payload,
            };
            break;
        case FETCH_CAR_FREAK_POSTS:
            state = {
                ...state,
                carFreakPosts: action.payload,
            };
            break;
        case FETCH_EDITED_POST:
            state = {
                ...state,
                editedPost: action.payload,
            };
            break;
        default:
            state = state
            break;
    }

    persistRedux('carfreak', state)
    return state;
}