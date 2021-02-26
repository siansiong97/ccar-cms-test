export const FETCH_NEWS = 'FETCH_NEWS';
export const FETCH_CLUB = 'FETCH_CLUB';
export const FETCH_PRICE = 'FETCH_PRICE';
export const FETCH_POPULAR = 'FETCH_POPULAR';
export const FETCH_POPULARCARS = 'FETCH_POPULARCARS';
export const FETCH_CARNAME = 'FETCH_CARNAME';
export const FETCH_CARDETAILS = 'FETCH_CARDETAILS';
export const FETCH_BRANDS = 'FETCH_BRANDS';
export const FETCH_BRANDDETAIL = 'FETCH_BRANDDETAIL';
export const FETCH_BRANDCARS = 'FETCH_BRANDCARS';
export const FETCH_DETAILS = 'FETCH_DETAILS';
export const FETCH_FUEL = 'FETCH_FUEL';
export const FETCH_FILTERED_COMPARE_DATA = 'FETCH_FILTERED_COMPARE_DATA';
export const FETCH_PEER_COMPARE_CARS = 'FETCH_PEER_COMPARE_CARS';
export const FETCH_COMPARE_NEWCAR_IDS = 'FETCH_COMPARE_NEWCAR_IDS';
export const ADD_COMPARE_NEWCAR_ID = 'ADD_COMPARE_NEWCAR_ID';
export const REMOVE_COMPARE_NEWCAR_ID = 'REMOVE_COMPARE_NEWCAR_ID';
export const FETCH_COMPARE__NEWCAR_LIMIT = 'FETCH_COMPARE__NEWCAR_LIMIT';
export const FETCH_NEW_CAR_FILTER_GROUP = 'FETCH_NEW_CAR_FILTER_GROUP';
export const RESET_NEW_CAR_FILTER_GROUP = 'RESET_NEW_CAR_FILTER_GROUP';

export function fetchNews(data){
  return (dispatch) => {
    dispatch({
      type: FETCH_NEWS,
      payload:data,
    });
  }
}

export function fetchClub(data){
  return (dispatch) => {
    dispatch({
      type: FETCH_CLUB,
      payload:data,
    });
  }
}

export function fetchPrice(data){
  return (dispatch) => {
    dispatch({
      type: FETCH_PRICE,
      payload:data,
    });
  }
}

export function fetchPopular(data){
  return (dispatch) => {
    dispatch({
      type: FETCH_POPULAR,
      payload:data,
    });
  }
}

export function fetchPopularCars(data){
  return (dispatch) => {
    dispatch({
      type: FETCH_POPULARCARS,
      payload:data,
    });
  }
}

export function fetchCarName(data){
  return (dispatch) => {
    dispatch({
      type: FETCH_CARNAME,
      payload:data,
    });
  }
}

export function fetchCarDetails(data){
  return (dispatch) => {
    dispatch({
      type: FETCH_CARDETAILS,
      payload:data,
    });
  }
}

export function fetchBrands(data){
  return (dispatch) => {
    dispatch({
      type: FETCH_BRANDS,
      payload:data,
    });
  }
}

export function fetchBrandDetail(data){
  return (dispatch) => {
    dispatch({
      type: FETCH_BRANDDETAIL,
      payload:data,
    });
  }
}

export function fetchBrandCars(data){
  return (dispatch) => {
    dispatch({
      type: FETCH_BRANDCARS,
      payload:data,
    });
  }
}

export function fetchDetails(data){
  return (dispatch) => {
    dispatch({
      type: FETCH_DETAILS,
      payload:data,
    });
  }
}

export function fetchFuel(data){
  return (dispatch) => {
    dispatch({
      type: FETCH_FUEL,
      payload:data,
    });
  }
}

export function filteredCompareData(data){
  return (dispatch) => {
    dispatch({
      type: FETCH_FILTERED_COMPARE_DATA,
      payload:data
    });
  }
}

export function fetchCompareNewCarIds(data){
  return (dispatch) => {
    dispatch({
      type: FETCH_COMPARE_NEWCAR_IDS,
      payload:data
    });
  }
}

export function addCompareNewCarId(data){
  return (dispatch) => {
    dispatch({
      type: ADD_COMPARE_NEWCAR_ID,
      payload:data
    });
  }
}

export function removeCompareNewCarId(data){
  return (dispatch) => {
    dispatch({
      type: REMOVE_COMPARE_NEWCAR_ID,
      payload:data
    });
  }
}


export function fetchCompareNewCarLimit(data){
  return (dispatch) => {
    dispatch({
      type: FETCH_COMPARE__NEWCAR_LIMIT,
      payload:data
    });
  }
}

export function fetchPeerCompareCars(data){
  return (dispatch) => {
    dispatch({
      type: FETCH_PEER_COMPARE_CARS,
      payload:data
    });
  }
}
export function fetchNewCarFilterGroup(data){
  return (dispatch) => {
    dispatch({
      type: FETCH_NEW_CAR_FILTER_GROUP,
      payload:data
    });
  }
}
export function resetNewCarFilterGroup(data){
  return (dispatch) => {
    dispatch({
      type: RESET_NEW_CAR_FILTER_GROUP,
    });
  }
}