import _ from 'lodash'
import moment from 'moment'
import {
  FETCH_PRODUCTSLIST,
  FETCH_PRODUCTSLIST_HOME,
  PUSH_PRODUCTSLIST,
  REMOVE_PRODUCTSLIST,
  UPDATE_PRODUCTSLIST,
  UPDATE_ACTIVE_ID_PRODUCTS_LIST,
  ADD_COMPARE__PRODUCT_ID,
  REMOVE_COMPARE_PRODUCT_ID,
  CLEAR_COMPARE_PRODUCT_IDS,
  PATCH_COMPARE_PRODUCT_IDS,
  FETCH_FILTERED_COMPARE_DATA,
  FETCH_FEATURES_LIST,
  UPDATE_CHECKED_FEATURES_DATE,
  FETCH_COMPARE_LIMIT,
  FETCH_PRODUCT_FILTER_OPTIONS,
  CLEAR_PRODUCT_FILTER_OPTIONS,
  FETCH_PRODUCT_FILTER_GROUP,
  CLEAR_PRODUCT_FILTER_GROUP,
  FETCH_PRODUCT_FILTER_CONFIG,
  CLEAR_PRODUCT_FILTER_CONFIG,
  FETCH_FILTER_MODAL_STATE,
  SET_PRODUCT_LIST_LOADING,
} from '../actions/productsList-actions';
import localStorage from 'local-storage';
import { checkIsNeedPersist, checkNeedPersist, getPersistObj, persistRedux } from '../config';

const INITIAL_STATE = {
  productListLoading: false,
  productsList: [],
  productsListHome: [],
  activeId: '',
  activeproductList: [],
  compareData: [],
  filteredCompareData: [],
  featuresList: [],
  checkedFeaturesDate: null,
  compareIds: [],
  compareLimit: 4,
  filterOptions: {},
  filterGroup: {},
  isFilterModalOpen: false,
  config: {},
}

export default function (state = INITIAL_STATE, action) {

  // checkNeedPersist(_.get(action, 'type'), 'productsList', _.get(action, 'payload'), _.get(action, 'isRestoreData'));

  let persistStates = _.get(localStorage.get('redux') || {}, 'productsList') || INITIAL_STATE;
  state = {
    ...state,
    ...persistStates,
  }
  switch (action.type) {
    case FETCH_PRODUCTSLIST:
      state = {
        ...state,
        productsList: action.payload
      }
      break;
    case FETCH_PRODUCTSLIST_HOME:
      state = {
        ...state,
        productsListHome: action.payload
      }
      break;
    case PUSH_PRODUCTSLIST:
      state = {
        ...state,
        productsList: [action.payload, ...state.productsList]
      }
      break;
    case REMOVE_PRODUCTSLIST:
      state = {
        ...state,
        productsList: [...state.productsList.filter((item) => item._id !== action.payload._id)]
      }
      break;
    case UPDATE_PRODUCTSLIST:
      let index = _.findIndex(state.productsList, { '_id': action.payload._id })
      state.productsList.splice(index, 1, action.payload)
      state = {
        ...state,
        productsList: state.productsList
      }
      break;
    case UPDATE_ACTIVE_ID_PRODUCTS_LIST:
      state = {
        ...state,
        activeId: action.id,
        activeproductList: _.pick(_.find(state.productsList, { '_id': action.id }), [
          'ownerMobileNumer',
          'carPlateNumber',
          'state',
          'carspecsAll',
          'ownerAddress',
          'companys',
          'description',
          'productType',
          'drivenWheel',
          'carspecsId',
          'createdAt',
          'condition',
          'ownerName',
          'companyId',
          'features',
          'bodyType',
          'fuelType',
          'mileage',
          'carUrl',
          'prefix',
          'color',
          'price',
          '_id'
        ])
      }
      break;
    case ADD_COMPARE__PRODUCT_ID:

      if (!state.compareIds) {
        state.compareIds = []
      }
      if (state.compareIds.length < state.compareLimit) {
        let checkIfExist = _.findIndex(state.compareIds, function (item) {
          state = item == action.payload;
        })
        if (checkIfExist == -1) {
          let temp = _.cloneDeep(state.compareIds)
          temp.push(action.payload)
          state = {
            ...state,
            compareIds: temp
          }
        } else {
          state = {
            ...state,
          }
        }
      } else {
        state = {
          ...state,
        }
      }
      break;
    case REMOVE_COMPARE_PRODUCT_ID:
      let temp = state.compareIds.filter((item) => item !== action.payload);

      state = {
        ...state,
        compareIds: temp,
      }
      break;
    case PATCH_COMPARE_PRODUCT_IDS:
      if (!Array.isArray(action.payload)) {
        action.payload = [];
      }
      state = {
        ...state,
        compareIds: action.payload
      }
      break;
    case CLEAR_COMPARE_PRODUCT_IDS:
      state = {
        ...state,
        compareIds: []
      }
      break;
    case FETCH_FILTERED_COMPARE_DATA:
      state = {
        ...state,
        filteredCompareData: action.payload
      }
    case FETCH_FEATURES_LIST:
      state = {
        ...state,
        featuresList: action.payload,
      }
      break;
    case UPDATE_CHECKED_FEATURES_DATE:
      state = {
        ...state,
        checkedFeaturesDate: moment(action.payload),
      }
      break;
    case FETCH_COMPARE_LIMIT:
      state = {
        ...state,
        compareLimit: action.payload,
      }
      break;
    case FETCH_PRODUCT_FILTER_OPTIONS:
      state = {
        ...state,
        filterOptions: action.payload,
      }
    case CLEAR_PRODUCT_FILTER_OPTIONS:
      state = {
        ...state,
        filterOptions: {},
      }
      break;
    case FETCH_PRODUCT_FILTER_GROUP:
      state = {
        ...state,
        filterGroup: action.payload,
      }
      break;
    case CLEAR_PRODUCT_FILTER_GROUP:
      state = {
        ...state,
        filterGroup: {},
      }
      break;
    case FETCH_PRODUCT_FILTER_CONFIG:
      state = {
        ...state,
        config: action.payload,
      }
      break;
    case CLEAR_PRODUCT_FILTER_CONFIG:
      state = {
        ...state,
        config: {},
      }
      break;
    case FETCH_FILTER_MODAL_STATE:
      state = {
        ...state,
        isFilterModalOpen: action.payload,
      }
    case SET_PRODUCT_LIST_LOADING:
      state = {
        ...state,
        productListLoading: action.payload,
      }
      break;
    default:
      state = state
  }


  persistRedux('productsList', state)
  return state;
}
