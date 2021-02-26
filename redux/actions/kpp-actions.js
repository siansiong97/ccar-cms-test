export const FETCH_REVISION_ANSWERED_QUESTIONS = 'FETCH_REVISION_ANSWERED_QUESTIONS';

export function fetchRevisionAnsweredQuestions(data){
  return (dispatch) => {
    dispatch({
      type: FETCH_REVISION_ANSWERED_QUESTIONS,
      payload:data,
    });
  }
}