export const LOGIN_SUCCESSFUL = 'LOGIN_SUCCESSFUL';
export const LOGOUT_SUCCESSFUL = 'LOGOUT_SUCCESSFUL';
export const ADDRESS_BOOK_FORM = 'ADDRESS_BOOK_FORM';
export const BANK_FORM = 'BANK_FORM';
export const CARD_FORM = 'CARD_FORM';
export const SET_USER = 'GET_AUTH_USER';

export function loginSuccessful(userInfo){
  return (dispatch) => {
    dispatch({
      type: LOGIN_SUCCESSFUL,
      payload:userInfo
    });
  }
}

export function logoutSuccessful(){
  return (dispatch) => {
    dispatch({
      type: LOGOUT_SUCCESSFUL,
      payload:false
    });
  }
}

export function setUser(userInfo){
  return (dispatch) => {
    dispatch({
      type: SET_USER,
      payload:userInfo
    });
  }
}

export function addressBookForm(form){
  return (dispatch) => {
    dispatch({
      type: ADDRESS_BOOK_FORM,
      payload:form
    });
  }
}
export function cardForm(form){
  return (dispatch) => {
    dispatch({
      type: CARD_FORM,
      payload:form
    });
  }
}
export function bankForm(form){
  return (dispatch) => {
    dispatch({
      type: BANK_FORM,
      payload:form
    });
  }
}