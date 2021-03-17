import { LOGIN_SUCCESSFUL, LOGOUT_SUCCESSFUL, SET_USER, ADDRESS_BOOK_FORM, CARD_FORM, BANK_FORM } from '../actions/user-actions';
import { checkIsNeedPersist, checkNeedPersist, getLocalStoragePersistStates, getPersistObj } from '../config';
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


  checkNeedPersist(_.get(action, 'type'), 'user', _.get(action, 'payload'), _.get(action, 'isRestoreData'));
  
  switch (action.type) {
    case LOGIN_SUCCESSFUL:
      return {
        ...state,
        authenticated: true,
        info: action.payload
      }
    case LOGOUT_SUCCESSFUL:
      return {
        ...state,
        authenticated: false,
        info: {}
      }
    case SET_USER:
      return {
        ...state,
        info: {
          ...state.info,
          user: action.payload,
        }
      }
    case ADDRESS_BOOK_FORM:


      return {
        ...state,
        addressForm: action.payload,
      }
    case CARD_FORM:


      return {
        ...state,
        cardForm: action.payload,
      }
    case BANK_FORM:


      return {
        ...state,
        bankForm: action.payload,
      }
    default:
      return state

  }

}
