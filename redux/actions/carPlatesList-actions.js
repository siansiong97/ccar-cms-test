export const FETCH_CARPLATESLIST = 'FETCH_CARPLATELIST';


export function fetchCarPlatesList(data){
    return (dispatch) => {
        dispatch({
            type: FETCH_CARPLATESLIST,
            payload:data
        });
    }
}
