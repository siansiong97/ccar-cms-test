import {
  LOADING,

  ADVANCE_MODE,
  LOGIN_MODE,
  REGISTER_MODE,
  UPDATE_ACTIVE_MENU,

  FILTER_CAR_BRAND_MODE,
  FILTER_CAR_SELECTED_CAR_BRAND_ROW,
  FILTER_CAR_SEARCH_KEYWORDS,

  FILTER_CAR_SELECTED_CAR_MODEL_ROW,
  FILTER_CAR_MODEL_SEARCH_KEYWORDS,
  FILTER_CAR_MODEL_MODE,

  FILTER_COLOR_MODE,
  FILTER_CAR_SELECTED_COLOR_MODEL_ROW,
  FILTER_COLOR_MODEL_SEARCH_KEYWORDS,

  FILTER_BODY_TYPE_MODE,
  FILTER_CAR_SELECTED_BODY_TYPE_MODEL_ROW,
  FILTER_BODY_TYPE_MODEL_SEARCH_KEYWORDS,

  FILTER_DRIVEN_WHEELS_MODE,
  FILTER_CAR_SELECTED_DRIVEN_WHEELS_MODEL_ROW,
  FILTER_DRIVEN_WHEELS_MODEL_SEARCH_KEYWORDS,

  FILTER_FUEL_TYPE_MODE,
  FILTER_CAR_SELECTED_FUEL_TYPE_MODEL_ROW,
  FILTER_FUEL_TYPE_MODEL_SEARCH_KEYWORDS,

  FILTER_STATE_MODE,
  FILTER_CAR_SELECTED_STATE_MODEL_ROW,
  FILTER_STATE_MODEL_SEARCH_KEYWORDS,

  FILTER_CAR_BRANDS,
  FILTER_CAR_MODELS,
  FILTER_COLORS,
  FILTER_BODY_TYPES,
  FILTER_DRIVEN_WHEELS,
  FILTER_FUEL_TYPES,
  FILTER_STATES,

  QUICK_SEARCH_PRODUCTS_LIST,

  SHOW_CONTACT_LIST,

  SET_APPLY_YEAR,
  SET_APPLY_PRICE,
  SET_APPLY_MILEAGE,

  SET_MENU_HEIGHT,
  SET_NOTIFICATION_TOKEN,
} from '../actions/app-actions';

import Cookie from 'js-cookie';
import { checkIsNeedPersist, getPersistObj } from '../config';
import _ from 'lodash';

const INITIAL_STATE = {
  notificationToken: null,

  loading: false,
  advanceMode: false,
  loginMode: false,
  registerMode: false,

  filterCarBrandMode: false,
  filterCarSelectedCarBrandData: '',
  filterCarSelectedCarBrandIndex: '',
  filterCarSearchKeywords: '',

  filterCarModelMode: false,
  filterCarSelectedCarModelData: '',
  filterCarSelectedCarModelIndex: '',
  filterCarModelSearchKeywords: '',

  filterCarModelMode: false,
  filterCarSelectedCarModelData: '',
  filterCarSelectedCarModelIndex: '',
  filterCarModelSearchKeywords: '',

  filterColorMode: false,
  filterCarSelectedColorData: '',
  filterCarSelectedColorIndex: '',
  filterColorSearchKeywords: '',

  filterBodyTypeMode: false,
  filterCarSelectedBodyTypeData: '',
  filterCarSelectedBodyTypeIndex: '',
  filterBodyTypeSearchKeywords: '',

  filterFuelTypeMode: false,
  filterCarSelectedFuelTypeData: '',
  filterCarSelectedFuelTypeIndex: '',
  filterFuelTypeSearchKeywords: '',

  filterStateMode: false,
  filterCarSelectedStateData: '',
  filterCarSelectedStateIndex: '',
  filterStateSearchKeywords: '',

  carBrands: [],
  carModels: [],
  colors: [],
  bodyTypes: [],
  drivenWheels: [],
  fuelTypes: [],
  states: [],

  quickSearchMode: '',
  quickSearchCarSpecsData: {},
  quickSearchProductadsData: {},
  activeMenu: -1,
  values: {},

  showContact: false,

  applyYear: undefined,
  applyPrice: undefined,
  applyMileage: undefined,

  menuHeight: undefined,
}

export default function (state = INITIAL_STATE, action) {


  let needPersist = checkIsNeedPersist(_.get(action, ['type']));

  if (needPersist) {
    let persistObj = getPersistObj(_.get(action, ['type']));
    let persistData = {
      data : action.payload,
      reducer: 'app',
      createdAt: new Date(),
    }
    Cookie.set(_.get(persistObj, ['action']), JSON.stringify(persistData));
  }
  switch (action.type) {
    case LOADING:
      return {
        ...state,
        loading: action.payload,
      }
    case ADVANCE_MODE:
      return {
        ...state,
        advanceMode: action.payload,
      }
    case LOGIN_MODE:
      return {
        ...state,
        loginMode: action.data
      };
    case REGISTER_MODE:
      return {
        ...state,
        registerMode: action.data
      };
    case UPDATE_ACTIVE_MENU:
      return {
        ...state,
        activeMenu: action.data
      };

    //
    case FILTER_CAR_BRANDS:
      return {
        ...state,
        carBrands: action.data
      };
    case FILTER_CAR_MODELS:
      return {
        ...state,
        carModels: action.data
      };
    case FILTER_COLORS:
      return {
        ...state,
        colors: action.data
      };
    case FILTER_BODY_TYPES:
      return {
        ...state,
        bodyTypes: action.data
      };
    case FILTER_DRIVEN_WHEELS:
      return {
        ...state,
        drivenWheels: action.data
      };
    case FILTER_FUEL_TYPES:
      return {
        ...state,
        fuelTypes: action.data
      };
    case FILTER_STATES:
      return {
        ...state,
        states: action.data
      };
    // filter car
    //.......................................
    case FILTER_CAR_BRAND_MODE:
      return {
        ...state,
        filterCarBrandMode: action.data
      };
    case FILTER_CAR_SELECTED_CAR_BRAND_ROW:
      if (action.index) {
        return {
          ...state,
          filterCarSelectedCarBrandData: action.data,
          filterCarSelectedCarBrandIndex: action.index
        };
      } else {
        return {
          ...state,
          filterCarSelectedCarBrandData: action.data
        };
      }
    case FILTER_CAR_SEARCH_KEYWORDS:
      return {
        ...state,
        filterCarSearchKeywords: action.data
      };
    // end filter car ..............................

    // filter car
    //.......................................
    case FILTER_CAR_MODEL_MODE:
      return {
        ...state,
        filterCarModelMode: action.data
      };
    case FILTER_CAR_SELECTED_CAR_MODEL_ROW:
      if (action.index) {
        return {
          ...state,
          filterCarSelectedCarModelData: action.data,
          filterCarSelectedCarModelIndex: action.index
        };
      } else {
        return {
          ...state,
          filterCarSelectedCarModelData: action.data
        };
      }
    case FILTER_CAR_MODEL_SEARCH_KEYWORDS:
      return {
        ...state,
        filterCarModelSearchKeywords: action.data
      };
    // end filter model ..............................

    // filter color
    //.......................................
    case FILTER_COLOR_MODE:
      return {
        ...state,
        filterColorMode: action.data
      };
    case FILTER_CAR_SELECTED_COLOR_MODEL_ROW:
      if (action.index) {
        return {
          ...state,
          filterCarSelectedColorData: action.data,
          filterCarSelectedColorIndex: action.index
        };
      } else {
        return {
          ...state,
          filterCarSelectedColorData: action.data
        };
      }
    case FILTER_COLOR_MODEL_SEARCH_KEYWORDS:
      return {
        ...state,
        filterColorSearchKeywords: action.data
      };
    // end filter model ..............................

    // filter body type
    //.......................................
    case FILTER_BODY_TYPE_MODE:
      return {
        ...state,
        filterBodyTypeMode: action.data
      };
    case FILTER_CAR_SELECTED_BODY_TYPE_MODEL_ROW:
      if (action.index) {
        return {
          ...state,
          filterCarSelectedBodyTypeData: action.data,
          filterCarSelectedBodyTypeIndex: action.index
        };
      } else {
        return {
          ...state,
          filterCarSelectedBodyTypeData: action.data
        };
      }
    case FILTER_BODY_TYPE_MODEL_SEARCH_KEYWORDS:
      return {
        ...state,
        filterBodyTypeSearchKeywords: action.data
      };
    // end filter model ..............................

    // filter driven wheels
    //.......................................
    case FILTER_DRIVEN_WHEELS_MODE:
      return {
        ...state,
        filterDrivenWheelMode: action.data
      };
    case FILTER_CAR_SELECTED_DRIVEN_WHEELS_MODEL_ROW:
      if (action.index) {
        return {
          ...state,
          filterCarSelectedDrivenWheelData: action.data,
          filterCarSelectedDrivenWheelIndex: action.index
        };
      } else {
        return {
          ...state,
          filterCarSelectedDrivenWheelData: action.data
        };
      }
    case FILTER_DRIVEN_WHEELS_MODEL_SEARCH_KEYWORDS:
      return {
        ...state,
        filterDrivenWheelSearchKeywords: action.data
      };
    // end filter driven wheels ..............................

    // filter driven wheels
    //.......................................
    case FILTER_FUEL_TYPE_MODE:
      return {
        ...state,
        filterFuelTypeMode: action.data
      };
    case FILTER_CAR_SELECTED_FUEL_TYPE_MODEL_ROW:
      if (action.index) {
        return {
          ...state,
          filterCarSelectedFuelTypeData: action.data,
          filterCarSelectedFuelTypeIndex: action.index
        };
      } else {
        return {
          ...state,
          filterCarSelectedFuelTypeData: action.data
        };
      }
    case FILTER_FUEL_TYPE_MODEL_SEARCH_KEYWORDS:
      return {
        ...state,
        filterFuelTypeSearchKeywords: action.data
      };
    // end filter driven wheels ..............................

    // filter driven wheels
    //.......................................
    case FILTER_STATE_MODE:
      return {
        ...state,
        filterStateMode: action.data
      };
    case FILTER_CAR_SELECTED_STATE_MODEL_ROW:
      if (action.index) {
        return {
          ...state,
          filterCarSelectedStateData: action.data,
          filterCarSelectedStateIndex: action.index
        };
      } else {
        return {
          ...state,
          filterCarSelectedStateData: action.data
        };
      }
    case FILTER_STATE_MODEL_SEARCH_KEYWORDS:
      return {
        ...state,
        filterStateSearchKeywords: action.data
      };
    // end filter driven wheels ..............................

    case QUICK_SEARCH_PRODUCTS_LIST:
      return {
        ...state,
        quickSearchMode: action.mode,
        quickSearchCarSpecsData: action.quickSearchCarSpecsData,
        quickSearchProductadsData: action.quickSearchProductadsData,
        values: action.values
      };
    case SHOW_CONTACT_LIST:
      return {
        ...state,
        showContact: action.boolean
      };
    case SET_APPLY_YEAR:
      return {
        ...state,
        applyYear: action.data
      };
    case SET_APPLY_PRICE:
      return {
        ...state,
        applyPrice: action.data
      };
    case SET_APPLY_MILEAGE:
      return {
        ...state,
        applyMileage: action.data
      };
    case SET_MENU_HEIGHT:
      return {
        ...state,
        menuHeight: action.data
      };
    case SET_NOTIFICATION_TOKEN:
      return {
        ...state,
        notificationToken: action.data
      };
    default:
      return state
  }
}