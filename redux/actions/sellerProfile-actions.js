//Action Types
export const UPDATE_SELLER_PROFILE = "UPDATE_SELLER_PROFILE";


//Action Creator
export function updateSellerProfile(data){
    return(dispatch) => {
        dispatch({
            type: UPDATE_SELLER_PROFILE,
            data: data
        });
    }
}
