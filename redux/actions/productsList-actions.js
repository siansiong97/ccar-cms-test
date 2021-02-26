export const FETCH_PRODUCTSLIST = 'FETCH_PRODUCTSLIST';
export const FETCH_PRODUCTSLIST_HOME = 'FETCH_PRODUCTSLIST_HOME';
export const PUSH_PRODUCTSLIST = 'PUSH_PRODUCTSLIST';
export const REMOVE_PRODUCTSLIST = 'REMOVE_PRODUCTSLIST';
export const UPDATE_PRODUCTSLIST = 'UPDATE_PRODUCTSLIST';
export const UPDATE_ACTIVE_ID_PRODUCTS_LIST = 'UPDATE_ACTIVE_ID_PRODUCTS_LIST';
export const ADD_COMPARE__PRODUCT_ID = 'ADD_COMPARE__PRODUCT_ID';
export const REMOVE_COMPARE_PRODUCT_ID = 'REMOVE_COMPARE_PRODUCT_ID';
export const CLEAR_COMPARE_PRODUCT_IDS = 'CLEAR_COMPARE_PRODUCT_IDS';
export const PATCH_COMPARE_PRODUCT_IDS = 'PATCH_COMPARE_PRODUCT_IDS';
export const FETCH_FILTERED_COMPARE_DATA = 'FETCH_FILTERED_COMPARE_DATA';
export const FETCH_FEATURES_LIST = 'FETCH_FEATURES_LIST';
export const UPDATE_CHECKED_FEATURES_DATE = 'UPDATE_CHECKED_FEATURES_DATE';
export const FETCH_COMPARE_LIMIT = 'FETCH_COMPARE_LIMIT';
export const FETCH_PRODUCT_FILTER_OPTIONS = 'FETCH_PRODUCT_FILTER_OPTIONS';
export const CLEAR_PRODUCT_FILTER_OPTIONS = 'CLEAR_PRODUCT_FILTER_OPTIONS';
export const FETCH_PRODUCT_FILTER_GROUP = 'FETCH_PRODUCT_FILTER_GROUP';
export const CLEAR_PRODUCT_FILTER_GROUP = 'CLEAR_PRODUCT_FILTER_GROUP';
export const FETCH_PRODUCT_FILTER_CONFIG = 'FETCH_PRODUCT_FILTER_CONFIG';
export const CLEAR_PRODUCT_FILTER_CONFIG = 'CLEAR_PRODUCT_FILTER_CONFIG';
export const FETCH_FILTER_MODAL_STATE = 'FETCH_FILTER_MODAL_STATE';
export const SET_PRODUCT_LIST_LOADING = 'SET_PRODUCT_LIST_LOADING';

export function fetchProductsList(data) {
  return (dispatch) => {
    dispatch({
      type: FETCH_PRODUCTSLIST,
      payload: data
    });
  }
}

export function fetchProductsListHome(data) {
  return (dispatch) => {
    dispatch({
      type: FETCH_PRODUCTSLIST_HOME,
      payload: data
    });
  }
}

export function pushProductsList(data) {
  return (dispatch) => {
    dispatch({
      type: PUSH_PRODUCTSLIST,
      payload: data
    });
  }
}

export function removeProductsList(data) {
  return (dispatch) => {
    dispatch({
      type: REMOVE_PRODUCTSLIST,
      payload: data
    });
  }
}

export function updateProductList(data) {
  return (dispatch) => {
    dispatch({
      type: UPDATE_PRODUCTSLIST,
      payload: data
    });
  }
}

export function updateActiveIdProductList(id) {
  return (dispatch) => {
    dispatch({
      type: UPDATE_ACTIVE_ID_PRODUCTS_LIST,
      id,
    });
  }
}

export function clearCompareProductIds() {
  return (dispatch) => {
    dispatch({
      type: CLEAR_COMPARE_PRODUCT_IDS,
    });
  }
}

export function filteredCompareData(data) {
  return (dispatch) => {
    dispatch({
      type: FETCH_FILTERED_COMPARE_DATA,
      payload: data
    });
  }
}

export function fetchFeaturesList(data) {
  return (dispatch) => {
    dispatch({
      type: FETCH_FEATURES_LIST,
      payload: data
    });
  }
}

export function updateCheckedFeaturesDate(data) {
  return (dispatch) => {
    dispatch({
      type: UPDATE_CHECKED_FEATURES_DATE,
      payload: data
    });
  }
}

export function fetchCompareCarLimit(data) {
  return (dispatch) => {
    dispatch({
      type: FETCH_COMPARE_LIMIT,
      payload: data
    });
  }
}

export function addCompareProductId(data) {
  return (dispatch) => {
    dispatch({
      type: ADD_COMPARE__PRODUCT_ID,
      payload: data
    });
  }
}

export function removeCompareProductId(data) {
  return (dispatch) => {
    dispatch({
      type: REMOVE_COMPARE_PRODUCT_ID,
      payload: data
    });
  }
}

export function patchCompareProductIds(data) {
  return (dispatch) => {
    dispatch({
      type: PATCH_COMPARE_PRODUCT_IDS,
      payload: data
    });
  }
}

export function fetchProductFilterOptions(data) {
  return (dispatch) => {
    dispatch({
      type: FETCH_PRODUCT_FILTER_OPTIONS,
      payload: data
    });
  }
}

export function clearProductFilterOptions(data) {
  return (dispatch) => {
    dispatch({
      type: CLEAR_PRODUCT_FILTER_OPTIONS,
      payload: {},
    });
  }
}

export function fetchProductFilterGroup(data) {
  return (dispatch) => {
    dispatch({
      type: FETCH_PRODUCT_FILTER_GROUP,
      payload: data
    });
  }
}
export function clearProductFilterGroup(data) {
  return (dispatch) => {
    dispatch({
      type: CLEAR_PRODUCT_FILTER_GROUP,
      payload: {},
    });
  }
}

export function fetchProductFilterConfig(data) {
  return (dispatch) => {
    dispatch({
      type: FETCH_PRODUCT_FILTER_CONFIG,
      payload: data
    });
  }
}
export function clearProductFilterConfig() {
  return (dispatch) => {
    dispatch({
      type: CLEAR_PRODUCT_FILTER_CONFIG,
      payload: {},
    });
  }
}
export function fetchFilterModalState(data) {
  return (dispatch) => {
    dispatch({
      type: FETCH_FILTER_MODAL_STATE,
      payload: data,
    });
  }
}
export function setProductListLoading(data) {
  return (dispatch) => {
    dispatch({
      type: SET_PRODUCT_LIST_LOADING,
      payload: data,
    });
  }
}