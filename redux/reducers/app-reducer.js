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
  SET_NOTIFICATION_TOKEN_TIME_OUT_DATE,
  SET_INITED_REDUX,
  SET_DISABLE_WINDOW_SCROLL,
} from '../actions/app-actions';

import localStorage from 'local-storage';
import { checkIsNeedPersist, checkNeedPersist, getPersistObj, persistRedux } from '../config';
import _ from 'lodash';
import app from 'next/app';


const INITIAL_STATE = {
  notificationToken: null,
  notificationTokenTimeOutDate: null,
  disableWindowScroll: false,

  initedRedux: false,
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


  // checkNeedPersist(_.get(action, 'type'), 'app', _.get(action, 'payload'), _.get(action, 'isRestoreData'));

  let persistStates = _.get(localStorage.get('redux') || {}, 'app') || INITIAL_STATE;
  state = {
    ...state,
    ...persistStates,
  }
  switch (action.type) {
    case LOADING:
      state = {
        ...state,
        loading: action.payload,
      };
      break;
    case ADVANCE_MODE:
      state = {
        ...state,
        advanceMode: action.payload,
      };
      break;
    case LOGIN_MODE:
      state = {
        ...state,
        loginMode: action.data
      };
      break;
    case REGISTER_MODE:
      state = {
        ...state,
        registerMode: action.data
      };
      break;
    case UPDATE_ACTIVE_MENU:
      state = {
        ...state,
        activeMenu: action.data
      };
      break;

    //
    case FILTER_CAR_BRANDS:
      state = {
        ...state,
        carBrands: action.data
      };
      break;
    case FILTER_CAR_MODELS:
      state = {
        ...state,
        carModels: action.data
      };
      break;
    case FILTER_COLORS:
      state = {
        ...state,
        colors: action.data
      };
      break;
    case FILTER_BODY_TYPES:
      state = {
        ...state,
        bodyTypes: action.data
      };
      break;
    case FILTER_DRIVEN_WHEELS:
      state = {
        ...state,
        drivenWheels: action.data
      };
      break;
    case FILTER_FUEL_TYPES:
      state = {
        ...state,
        fuelTypes: action.data
      };
      break;
    case FILTER_STATES:
      state = {
        ...state,
        states: action.data
      };
      break;
    // filter car
    //.......................................
    case FILTER_CAR_BRAND_MODE:
      state = {
        ...state,
        filterCarBrandMode: action.data
      };
      break;
    case FILTER_CAR_SELECTED_CAR_BRAND_ROW:
      if (action.index) {
        state = {
          ...state,
          filterCarSelectedCarBrandData: action.data,
          filterCarSelectedCarBrandIndex: action.index
        };
        break;
      } else {
        state = {
          ...state,
          filterCarSelectedCarBrandData: action.data
        };
        break;
      }
    case FILTER_CAR_SEARCH_KEYWORDS:
      state = {
        ...state,
        filterCarSearchKeywords: action.data
      };
      break;
    // end filter car ..............................

    // filter car
    //.......................................
    case FILTER_CAR_MODEL_MODE:
      state = {
        ...state,
        filterCarModelMode: action.data
      };
      break;
    case FILTER_CAR_SELECTED_CAR_MODEL_ROW:
      if (action.index) {
        state = {
          ...state,
          filterCarSelectedCarModelData: action.data,
          filterCarSelectedCarModelIndex: action.index
        };
        break;
      } else {
        state = {
          ...state,
          filterCarSelectedCarModelData: action.data
        };
        break;
      }
    case FILTER_CAR_MODEL_SEARCH_KEYWORDS:
      state = {
        ...state,
        filterCarModelSearchKeywords: action.data
      };
      break;
    // end filter model ..............................

    // filter color
    //.......................................
    case FILTER_COLOR_MODE:
      state = {
        ...state,
        filterColorMode: action.data
      };
      break;
    case FILTER_CAR_SELECTED_COLOR_MODEL_ROW:
      if (action.index) {
        state = {
          ...state,
          filterCarSelectedColorData: action.data,
          filterCarSelectedColorIndex: action.index
        };
        break;
      } else {
        state = {
          ...state,
          filterCarSelectedColorData: action.data
        };
        break;
      }
    case FILTER_COLOR_MODEL_SEARCH_KEYWORDS:
      state = {
        ...state,
        filterColorSearchKeywords: action.data
      };
      break;
    // end filter model ..............................

    // filter body type
    //.......................................
    case FILTER_BODY_TYPE_MODE:
      state = {
        ...state,
        filterBodyTypeMode: action.data
      };
      break;
    case FILTER_CAR_SELECTED_BODY_TYPE_MODEL_ROW:
      if (action.index) {
        state = {
          ...state,
          filterCarSelectedBodyTypeData: action.data,
          filterCarSelectedBodyTypeIndex: action.index
        };
        break;
      } else {
        state = {
          ...state,
          filterCarSelectedBodyTypeData: action.data
        };
        break;
      }
    case FILTER_BODY_TYPE_MODEL_SEARCH_KEYWORDS:
      state = {
        ...state,
        filterBodyTypeSearchKeywords: action.data
      };
      break;
    // end filter model ..............................

    // filter driven wheels
    //.......................................
    case FILTER_DRIVEN_WHEELS_MODE:
      state = {
        ...state,
        filterDrivenWheelMode: action.data
      };
      break;
    case FILTER_CAR_SELECTED_DRIVEN_WHEELS_MODEL_ROW:
      if (action.index) {
        state = {
          ...state,
          filterCarSelectedDrivenWheelData: action.data,
          filterCarSelectedDrivenWheelIndex: action.index
        };
        break;
      } else {
        state = {
          ...state,
          filterCarSelectedDrivenWheelData: action.data
        };
        break;
      }
    case FILTER_DRIVEN_WHEELS_MODEL_SEARCH_KEYWORDS:
      state = {
        ...state,
        filterDrivenWheelSearchKeywords: action.data
      };
      break;
    // end filter driven wheels ..............................

    // filter driven wheels
    //.......................................
    case FILTER_FUEL_TYPE_MODE:
      state = {
        ...state,
        filterFuelTypeMode: action.data
      };
      break;
    case FILTER_CAR_SELECTED_FUEL_TYPE_MODEL_ROW:
      if (action.index) {
        state = {
          ...state,
          filterCarSelectedFuelTypeData: action.data,
          filterCarSelectedFuelTypeIndex: action.index
        };
        break;
      } else {
        state = {
          ...state,
          filterCarSelectedFuelTypeData: action.data
        };
        break;
      }
    case FILTER_FUEL_TYPE_MODEL_SEARCH_KEYWORDS:
      state = {
        ...state,
        filterFuelTypeSearchKeywords: action.data
      };
      break;
    // end filter driven wheels ..............................

    // filter driven wheels
    //.......................................
    case FILTER_STATE_MODE:
      state = {
        ...state,
        filterStateMode: action.data
      };
      break;
    case FILTER_CAR_SELECTED_STATE_MODEL_ROW:
      if (action.index) {
        state = {
          ...state,
          filterCarSelectedStateData: action.data,
          filterCarSelectedStateIndex: action.index
        };
        break;
      } else {
        state = {
          ...state,
          filterCarSelectedStateData: action.data
        };
        break;
      }
    case FILTER_STATE_MODEL_SEARCH_KEYWORDS:
      state = {
        ...state,
        filterStateSearchKeywords: action.data
      };
      break;
    // end filter driven wheels ..............................

    case QUICK_SEARCH_PRODUCTS_LIST:
      state = {
        ...state,
        quickSearchMode: action.mode,
        quickSearchCarSpecsData: action.quickSearchCarSpecsData,
        quickSearchProductadsData: action.quickSearchProductadsData,
        values: action.values
      };
      break;
    case SHOW_CONTACT_LIST:
      state = {
        ...state,
        showContact: action.boolean
      };
      break;
    case SET_APPLY_YEAR:
      state = {
        ...state,
        applyYear: action.data
      };
      break;
    case SET_APPLY_PRICE:
      state = {
        ...state,
        applyPrice: action.data
      };
      break;
    case SET_APPLY_MILEAGE:
      state = {
        ...state,
        applyMileage: action.data
      };
      break;
    case SET_MENU_HEIGHT:
      state = {
        ...state,
        menuHeight: action.data
      };
      break;
    case SET_NOTIFICATION_TOKEN:
      state = {
        ...state,
        notificationToken: action.data
      };
      break;
    case SET_NOTIFICATION_TOKEN_TIME_OUT_DATE:
      state = {
        ...state,
        notificationTokenTimeOutDate: action.data
      };
      break;
    case SET_INITED_REDUX:
      state = {
        ...state,
        initedRedux: action.data
      };
      break;
      case SET_DISABLE_WINDOW_SCROLL:
        state = {
          ...state,
          disableWindowScroll: action.data == true ? true : false,
        };
        break;
    default:
      state = state
      break;
  }


  persistRedux('app', state)
  return state;
}