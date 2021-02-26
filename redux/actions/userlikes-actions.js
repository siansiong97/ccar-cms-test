export const ADD_LIKE = 'ADD_LIKE';
export const REMOVE_LIKE = 'REMOVE_LIKE';
export const ADD_BOOKMARK = 'ADD_BOOKMARK';
export const REMOVE_BOOKMARK = 'REMOVE_BOOKMARK';
export const ADD_LIKE_MSG = 'ADD_LIKE_MSG';
export const REMOVE_LIKE_MSG = 'REMOVE_LIKE_MSG';
 

export function addLike(value){
  return (dispatch) => {
    dispatch({
      type: ADD_LIKE,
      value:value
    });
  }
}

export function removeLike(value){
  return (dispatch) => {
    dispatch({
      type: REMOVE_LIKE,
      value:value
    });
  }
}
export function addBookmark(value){
  return (dispatch) => {
    dispatch({
      type: ADD_BOOKMARK,
      value:value
    });
  }
}

export function removeBookmark(value){
  return (dispatch) => {
    dispatch({
      type: REMOVE_BOOKMARK,
      value:value
    });
  }
}
export function addLikeMsg(value){
  return (dispatch) => {
    dispatch({
      type: ADD_LIKE_MSG,
      value:value
    });
  }
}

export function removeLikeMsg(value){
  return (dispatch) => {
    dispatch({
      type: REMOVE_LIKE_MSG,
      value:value
    });
  }
}