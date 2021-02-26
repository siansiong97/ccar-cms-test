export const LOADING = 'LOADING';

export const ADVANCE_MODE = 'ADVANCE_MODE';
export const LOGIN_MODE = 'LOGIN_MODE';
export const REGISTER_MODE = 'REGISTER_MODE';
export const UPDATE_ACTIVE_MENU = 'UPDATE_ACTIVE_MENU';

export const FILTER_CAR_BRAND_MODE = 'FILTER_CAR_BRAND_MODE';
export const FILTER_CAR_SELECTED_CAR_BRAND_ROW = 'FILTER_CAR_SELECTED_CAR_BRAND_ROW';
export const FILTER_CAR_SEARCH_KEYWORDS = 'FILTER_CAR_SEARCH_KEYWORDS';

export const FILTER_CAR_MODEL_MODE = 'FILTER_CAR_MODEL_MODE';
export const FILTER_CAR_SELECTED_CAR_MODEL_ROW = 'FILTER_CAR_SELECTED_CAR_MODEL_ROW';
export const FILTER_CAR_MODEL_SEARCH_KEYWORDS = 'FILTER_CAR_MODEL_SEARCH_KEYWORDS';

export const FILTER_COLOR_MODE = 'FILTER_COLOR_MODE';
export const FILTER_CAR_SELECTED_COLOR_MODEL_ROW = 'FILTER_CAR_SELECTED_COLOR_MODEL_ROW';
export const FILTER_COLOR_MODEL_SEARCH_KEYWORDS = 'FILTER_COLOR_MODEL_SEARCH_KEYWORDS';

export const FILTER_BODY_TYPE_MODE = 'FILTER_BODY_TYPE_MODE';
export const FILTER_CAR_SELECTED_BODY_TYPE_MODEL_ROW = 'FILTER_CAR_SELECTED_BODY_TYPE_MODEL_ROW';
export const FILTER_BODY_TYPE_MODEL_SEARCH_KEYWORDS = 'FILTER_BODY_TYPE_MODEL_SEARCH_KEYWORDS';

export const FILTER_DRIVEN_WHEELS_MODE = 'FILTER_DRIVEN_WHEELS_MODE';
export const FILTER_CAR_SELECTED_DRIVEN_WHEELS_MODEL_ROW = 'FILTER_CAR_SELECTED_DRIVEN_WHEELS_MODEL_ROW';
export const FILTER_DRIVEN_WHEELS_MODEL_SEARCH_KEYWORDS = 'FILTER_DRIVEN_WHEELS_MODEL_SEARCH_KEYWORDS';

export const FILTER_FUEL_TYPE_MODE = 'FILTER_FUEL_TYPE_MODE';
export const FILTER_CAR_SELECTED_FUEL_TYPE_MODEL_ROW = 'FILTER_CAR_SELECTED_FUEL_TYPE_MODEL_ROW';
export const FILTER_FUEL_TYPE_MODEL_SEARCH_KEYWORDS = 'FILTER_FUEL_TYPE_MODEL_SEARCH_KEYWORDS';

export const FILTER_STATE_MODE = 'FILTER_STATE_MODE';
export const FILTER_CAR_SELECTED_STATE_MODEL_ROW = 'FILTER_CAR_SELECTED_STATE_MODEL_ROW';
export const FILTER_STATE_MODEL_SEARCH_KEYWORDS = 'FILTER_STATE_MODEL_SEARCH_KEYWORDS';

export const QUICK_SEARCH_PRODUCTS_LIST = 'QUICK_SEARCH_PRODUCTS_LIST';

export const SHOW_CONTACT_LIST = 'SHOW_CONTACT_LIST';

export const SET_APPLY_YEAR = 'SET_APPLY_YEAR';
export const SET_APPLY_PRICE = 'SET_APPLY_PRICE';
export const SET_APPLY_MILEAGE = 'SET_APPLY_MILEAGE';

export const FILTER_CAR_BRANDS = 'FILTER_CAR_BRANDS';
export const FILTER_CAR_MODELS = 'FILTER_CAR_MODELS';
export const FILTER_COLORS = 'FILTER_COLORS';
export const FILTER_BODY_TYPES = 'FILTER_BODY_TYPES';
export const FILTER_DRIVEN_WHEELS = 'FILTER_DRIVEN_WHEELS';
export const FILTER_FUEL_TYPES = 'FILTER_FUEL_TYPES';
export const FILTER_STATES = 'FILTER_STATES';

export const SET_MENU_HEIGHT = 'SET_MENU_HEIGHT';

export const SET_NOTIFICATION_TOKEN = 'SET_NOTIFICATION_TOKEN';


//fetch quick filter
export function filterCarBrands(data){
  return (dispatch) => {
    dispatch({
      type: FILTER_CAR_BRANDS,
      data: data
    })
  }
}

export function filterCarModels(data){
  return (dispatch) => {
    dispatch({
      type: FILTER_CAR_MODELS,
      data: data
    })
  }
}

export function filterColors(data){
  return (dispatch) => {
    dispatch({
      type: FILTER_COLORS,
      data: data
    })
  }
}

export function filterBodyTypes(data){
 
  return (dispatch) => {
    dispatch({
      type: FILTER_BODY_TYPES,
      data: data
    })
  }
}

export function filterDrivenWheels(data){
  return (dispatch) => {
    dispatch({
      type: FILTER_DRIVEN_WHEELS,
      data: data
    })
  }
}

export function filterFuelTypes(data){
  return (dispatch) => {
    dispatch({
      type: FILTER_FUEL_TYPES,
      data: data
    })
  }
}

export function filterStates(data){
  return (dispatch) => {
    dispatch({
      type: FILTER_STATES,
      data: data
    })
  }
}
//end fetch quick filter
export function loading(data){
  return (dispatch) => {
    dispatch({
      type: LOADING,
      payload : data,
    });
  }
}

export function advanceMode(data){
  return (dispatch) => {
    dispatch({
      type: ADVANCE_MODE,
      payload:data
    });
  }
}

export function loginMode(data){
  return (dispatch) => {
    dispatch({
      type: LOGIN_MODE,
      data: data
    })
  }
};

export function registerMode(data){
  return (dispatch) => {
    dispatch({
      type: REGISTER_MODE,
      data: data
    })
  }
};

export function updateActiveMenu(data){
  return (dispatch) => {
    dispatch({
      type: UPDATE_ACTIVE_MENU,
      data: data
    })
  }
}

// filter car
//................................................
export function filterCarBrandMode(data){
  return (dispatch) => {
    dispatch({
      type: FILTER_CAR_BRAND_MODE,
      data: data
    })
  }
}

export function filterCarSelectedCarBrandsRow(data, index){
  return (dispatch) => {
    dispatch({
      type: FILTER_CAR_SELECTED_CAR_BRAND_ROW,
      data: data,
      index: index,
    })
  }
}

export function filterCarSearchKeywords(data){
  return (dispatch) => {
    dispatch({
      type: FILTER_CAR_SEARCH_KEYWORDS,
      data: data
    })
  }
}
// end filter car .......................................

// filter model
//................................................

export function filterCarModelMode(data){
  return (dispatch) => {
    dispatch({
      type: FILTER_CAR_MODEL_MODE,
      data: data
    })
  }
}

export function filterCarSelectedCarModelsRow(data, index){
  return (dispatch) => {
    dispatch({
      type: FILTER_CAR_SELECTED_CAR_MODEL_ROW,
      data: data,
      index: index,
    })
  }
}

export function filterCarModelSearchKeywords(data){
  return (dispatch) => {
    dispatch({
      type: FILTER_CAR_MODEL_SEARCH_KEYWORDS,
      data: data
    })
  }
}
// end filter model .......................................

// filter color
//................................................
export function filterColorMode(data){
  return (dispatch) => {
    dispatch({
      type: FILTER_COLOR_MODE,
      data: data
    })
  }
}

export function filterCarSelectedColorRow(data, index){
  return (dispatch) => {
    dispatch({
      type: FILTER_CAR_SELECTED_COLOR_MODEL_ROW,
      data: data,
      index: index,
    })
  }
}

export function filterColorSearchKeywords(data){
  return (dispatch) => {
    dispatch({
      type: FILTER_COLOR_MODEL_SEARCH_KEYWORDS,
      data: data
    })
  }
}
// end filter color .......................................
export function filterBodyTypeMode(data){
  return (dispatch) => {
    dispatch({
      type: FILTER_BODY_TYPE_MODE,
      data: data
    })
  }
}

export function filterCarSelectedBodyTypeRow(data, index){
  return (dispatch) => {
    dispatch({
      type: FILTER_CAR_SELECTED_BODY_TYPE_MODEL_ROW,
      data: data,
      index: index,
    })
  }
}

export function filterBodyTypeSearchKeywords(data){
  return (dispatch) => {
    dispatch({
      type: FILTER_BODY_TYPE_MODEL_SEARCH_KEYWORDS,
      data: data
    })
  }
}
// end filter body type .......................................

// filter driven wheels
//................................................
export function filterDrivenWheelMode(data){
  return (dispatch) => {
    dispatch({
      type: FILTER_DRIVEN_WHEELS_MODE,
      data: data
    })
  }
}

export function filterCarSelectedDrivenWheelRow(data, index){
  return (dispatch) => {
    dispatch({
      type: FILTER_CAR_SELECTED_DRIVEN_WHEELS_MODEL_ROW,
      data: data,
      index: index,
    })
  }
}

export function filterDrivenWheelSearchKeywords(data){
  return (dispatch) => {
    dispatch({
      type: FILTER_DRIVEN_WHEELS_MODEL_SEARCH_KEYWORDS,
      data: data
    })
  }
}
// end filter driven wheel .......................................

// filter fuel type
//................................................
export function filterFuelTypeMode(data){
  return (dispatch) => {
    dispatch({
      type: FILTER_FUEL_TYPE_MODE,
      data: data
    })
  }
}

export function filterCarSelectedFuelTypeRow(data, index){
  return (dispatch) => {
    dispatch({
      type: FILTER_CAR_SELECTED_FUEL_TYPE_MODEL_ROW,
      data: data,
      index: index,
    })
  }
}

export function filterFuelTypeSearchKeywords(data){
  return (dispatch) => {
    dispatch({
      type: FILTER_FUEL_TYPE_MODEL_SEARCH_KEYWORDS,
      data: data
    })
  }
}
// end filter fuel type .......................................

// filter state
//................................................
export function filterStateMode(data){
  return (dispatch) => {
    dispatch({
      type: FILTER_STATE_MODE,
      data: data
    })
  }
}

export function filterCarSelectedStateRow(data, index){
  return (dispatch) => {
    dispatch({
      type: FILTER_CAR_SELECTED_STATE_MODEL_ROW,
      data: data,
      index: index,
    })
  }
}

export function filterStateSearchKeywords(data){
  return (dispatch) => {
    dispatch({
      type: FILTER_STATE_MODEL_SEARCH_KEYWORDS,
      data: data
    })
  }
}
// end filter state .......................................

export function quickSearchProductsList(mode, quickSearchCarSpecsData, quickSearchProductadsData, values){
  return (dispatch) => {
    dispatch({
      type: QUICK_SEARCH_PRODUCTS_LIST,
      mode: mode,
      quickSearchCarSpecsData,
      quickSearchProductadsData,
      values,
    })
  }
}

export function showContactList(boolean){
  return (dispatch) => {
    dispatch({
      type: SHOW_CONTACT_LIST,
      boolean,
    })
  }
}

export function setApplyYear(data){
  return (dispatch) => {
    dispatch({
      type: SET_APPLY_YEAR,
      data,
    })
  }
}

export function setApplyPrice(data){
  return (dispatch) => {
    dispatch({
      type: SET_APPLY_PRICE,
      data,
    })
  }
}

export function setApplyMileage(data){
  return (dispatch) => {
    dispatch({
      type: SET_APPLY_MILEAGE,
      data,
    })
  }
}

export function setMenuHeight(data){
  return (dispatch) => {
    dispatch({
      type: SET_MENU_HEIGHT,
      data,
    })
  }
}

export function setNotificationToken(data){
  return (dispatch) => {
    dispatch({
      type: SET_NOTIFICATION_TOKEN,
      data,
    })
  }
}