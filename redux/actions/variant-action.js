export const FETCH_VARIANT = 'FETCH_VARIANT';
export const CLEAR_VARIANT = 'CLEAR_VARIANT';

export function fetchVariant(data){
  return (dispatch) => {
    dispatch({
      type: FETCH_VARIANT,
      payload:data,
    });
  }
}

export function clearVariant(data){
    return (dispatch) => {
      dispatch({
        type: CLEAR_VARIANT,
      });
    }
  }
  