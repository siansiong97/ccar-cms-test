export const UPDATE_SOCKET_INFO = 'UPDATE_SOCKET_INFO';
export const DELETE_SOCKET_INFO = 'DELETE_SOCKET_INFO';

export function updateSocketInfo(socketInfo){
  return (dispatch) => {
    dispatch({
      type: UPDATE_SOCKET_INFO,
      payload:socketInfo
    });
  }
}

export function deleteSocketInfo(){
  return (dispatch) => {
    dispatch({
      type: DELETE_SOCKET_INFO,
      payload:false
    });
  }
}