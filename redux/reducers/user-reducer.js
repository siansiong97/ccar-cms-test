import { LOGIN_SUCCESSFUL, LOGOUT_SUCCESSFUL, SET_USER, ADDRESS_BOOK_FORM, CARD_FORM, BANK_FORM } from '../actions/user-actions';
import { checkIsNeedPersist, getPersistObj } from '../config';
import _ from 'lodash';
import localStorage from 'local-storage';

const INITIAL_STATE = {
  info: {
    user: {}
  },
  authenticated: false,
  loading: false,
  errors: {},
  addressForm: {},
  cardForm: {},
  bankForm: {},
}

export default function (state = INITIAL_STATE, action) {


  let needPersist = checkIsNeedPersist(_.get(action, ['type']));

  if (needPersist) {
    let persistObj = getPersistObj(_.get(action, ['type']));
    let persistData = {
      data: action.payload,
      reducer: 'user',
      createdAt: new Date(),
    }
    localStorage.set(_.get(persistObj, ['action']), persistData);
  }
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
