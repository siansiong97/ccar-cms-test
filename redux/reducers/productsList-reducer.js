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
import Cookie from 'js-cookie';
import { checkIsNeedPersist, getPersistObj } from '../config';

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

  let needPersist = checkIsNeedPersist(_.get(action, ['type']));

  if (needPersist) {
    let persistObj = getPersistObj(_.get(action, ['type']));
    let persistData = {
      data: action.payload,
      reducer: 'productsList',
      createdAt: new Date(),
    }
    Cookie.set(_.get(persistObj, ['action']), JSON.stringify(persistData));
  }
  switch (action.type) {
    case FETCH_PRODUCTSLIST:
      return {
        ...state,
        productsList: action.payload
      }
    case FETCH_PRODUCTSLIST_HOME:
      return {
        ...state,
        productsListHome: action.payload
      }
    case PUSH_PRODUCTSLIST:
      return {
        ...state,
        productsList: [action.payload, ...state.products]
      }
    case REMOVE_PRODUCTSLIST:
      return {
        ...state,
        productsList: [...state.productsList.filter((item) => item._id !== action.payload._id)]
      }
    case UPDATE_PRODUCTSLIST:
      let index = _.findIndex(state.productsList, { '_id': action.payload._id })
      state.productsList.splice(index, 1, action.payload)
      return {
        ...state,
        productsList: state.productsList
      }
    case UPDATE_ACTIVE_ID_PRODUCTS_LIST:
      return {
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
    case ADD_COMPARE__PRODUCT_ID:

      if (!state.compareIds) {
        state.compareIds = []
      }
      if (state.compareIds.length < state.compareLimit) {
        let checkIfExist = _.findIndex(state.compareIds, function (item) {
          return item == action.payload;
        })
        if (checkIfExist == -1) {
          let temp = _.cloneDeep(state.compareIds)
          temp.push(action.payload)
          return {
            ...state,
            compareIds: temp
          }
        } else {
          return {
            ...state,
          }
        }
      } else {
        return {
          ...state,
        }
      }
    case REMOVE_COMPARE_PRODUCT_ID:
      let temp = state.compareIds.filter((item) => item !== action.payload);

      return {
        ...state,
        compareIds: temp,
      }
    case PATCH_COMPARE_PRODUCT_IDS:
      if (!Array.isArray(action.payload)) {
        action.payload = [];
      }
      return {
        ...state,
        compareIds: action.payload
      }
    case CLEAR_COMPARE_PRODUCT_IDS:
      return {
        ...state,
        compareIds: []
      }
    case FETCH_FILTERED_COMPARE_DATA:
      return {
        ...state,
        filteredCompareData: action.payload
      }
    case FETCH_FEATURES_LIST:
      return {
        ...state,
        featuresList: action.payload,
      }
    case UPDATE_CHECKED_FEATURES_DATE:
      return {
        ...state,
        checkedFeaturesDate: moment(action.payload),
      }
    case FETCH_COMPARE_LIMIT:
      return {
        ...state,
        compareLimit: action.payload,
      }
    case FETCH_PRODUCT_FILTER_OPTIONS:
      return {
        ...state,
        filterOptions: action.payload,
      }
    case CLEAR_PRODUCT_FILTER_OPTIONS:
      return {
        ...state,
        filterOptions: {},
      }
    case FETCH_PRODUCT_FILTER_GROUP:
      return {
        ...state,
        filterGroup: action.payload,
      }
    case CLEAR_PRODUCT_FILTER_GROUP:
      return {
        ...state,
        filterGroup: {},
      }
    case FETCH_PRODUCT_FILTER_CONFIG:
      return {
        ...state,
        config: action.payload,
      }
    case CLEAR_PRODUCT_FILTER_CONFIG:
      return {
        ...state,
        config: {},
      }
    case FETCH_FILTER_MODAL_STATE:
      return {
        ...state,
        isFilterModalOpen: action.payload,
      }
    case SET_PRODUCT_LIST_LOADING:
      return {
        ...state,
        productListLoading: action.payload,
      }
    default:
      return state

  }
}
