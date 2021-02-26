//Action Types
export const STEPS_PROPS_CURRENT = 'STEPS_PROPS_CURRENT';
export const FORM_ONE = 'FORM_ONE';

//Action Creator
export function stepsPropsCurrent(data){
    return(dispatch) => {
        dispatch({
            type: STEPS_PROPS_CURRENT,
            data: data
        });
    }
}

export function formOne(data){
    return(dispatch) => {
        dispatch({
            type: FORM_ONE,
            data: data
        });
    }
}
