export const FETCH_CLIENT_SOCKET_IO = 'FETCH_CLIENT_SOCKET_IO';
export const CLEAR_CLIENT_SOCKET_IO = 'CLEAR_CLIENT_SOCKET_IO';

export function fetchClientSocketIo(data){
  return (dispatch) => {
    dispatch({
      type: FETCH_CLIENT_SOCKET_IO,
      payload:data,
    });
  }
}
export function clearClientSocketIo(data){
  return (dispatch) => {
    dispatch({
      type: CLEAR_CLIENT_SOCKET_IO,
    });
  }
}