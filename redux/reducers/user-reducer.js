import { LOGIN_SUCCESSFUL, LOGOUT_SUCCESSFUL, SET_USER, ADDRESS_BOOK_FORM, CARD_FORM, BANK_FORM } from '../actions/user-actions';
import { checkIsNeedPersist, checkNeedPersist, getLocalStoragePersistStates, getPersistObj, persistRedux } from '../config';
import _ from 'lodash';
import localStorage from 'local-storage';
import { isValidNumber } from '../../common-function';


const INITIAL_STATE = {
  info: {
    user: {
      _id: null,
    }
  },
  authenticated: false,
  loading: false,
  errors: {},
  addressForm: {},
  cardForm: {},
  bankForm: {},
}
export default function (state = INITIAL_STATE, action) {


  let persistStates = _.get(localStorage.get('redux') || {}, 'user') || INITIAL_STATE;
  let newState = {
    ...state,
    ...persistStates
  }
  // checkNeedPersist(_.get(action, 'type'), 'user', _.get(action, 'payload'), _.get(action, 'isRestoreData'));

  if(!_.isEqual(state, newState)){
    state = newState;
  }
  switch (action.type) {
    case LOGIN_SUCCESSFUL:
      state = {
        ...state,
        authenticated: true,
        info: action.payload
      }
      break;
    case LOGOUT_SUCCESSFUL:
      state = {
        ...state,
        authenticated: false,
        info: {}
      }
      break;
    case SET_USER:
      state = {
        ...state,
        info: {
          ...state.info,
          user: action.payload,
        }
      }
      break;
    case ADDRESS_BOOK_FORM:
      state = {
        ...state,
        addressForm: action.payload,
      }
      break;
    case CARD_FORM:
      state = {
        ...state,
        cardForm: action.payload,
      }
      break;
    case BANK_FORM:
      state = {
        ...state,
        bankForm: action.payload,
      }
      break;
    default:
      break;
  }

  persistRedux('user', state);
  return state;

}
