import _ from 'lodash'
import moment from 'moment'
import {
  FETCH_NEWS,
  FETCH_CLUB,
  FETCH_PRICE,
  FETCH_POPULAR,
  FETCH_POPULARCARS,
  FETCH_CARNAME,
  FETCH_CARDETAILS,
  FETCH_BRANDS,
  FETCH_BRANDDETAIL,
  FETCH_BRANDCARS,
  FETCH_DETAILS,
  FETCH_FILTERED_COMPARE_DATA,
  FETCH_FUEL,
  FETCH_COMPARE_NEWCAR_IDS,
  ADD_COMPARE_NEWCAR_ID,
  REMOVE_COMPARE_NEWCAR_ID,
  FETCH_COMPARE__NEWCAR_LIMIT,
  FETCH_PEER_COMPARE_CARS,
  FETCH_NEW_CAR_FILTER_GROUP,
  RESET_NEW_CAR_FILTER_GROUP,
} from '../actions/newcars-actions';
import localStorage from 'local-storage';
import { checkIsNeedPersist, getPersistObj } from '../config';

const INITIAL_STATE = {
  news: [],
  club: [],
  price: [],
  popular: [],
  popularCars: [],
  CarName: {},
  brands: [],
  brandDetail: [],
  brandCars: [],
  details: [],
  fuel: [],
  filteredCompareData: [],
  newCarFilterGroup: {
    make: '',
    bodyType: '',
    transmission: '',
    drivenwheel: '',
    seatCapacity: '',
    fuelType: '',
    exterior: '',
    interior: '',
    safety: '',
    priceRange: [],
    monthlyPaymentRange: [],
    engineCapacityRange: [],
  },
  peerComp: [],
  compareIds: [],
  compareLimit: -1,
}

export default function (state = INITIAL_STATE, action) {

  let needPersist = checkIsNeedPersist(_.get(action, ['type']));

  if (needPersist) {
    let persistObj = getPersistObj(_.get(action, ['type']));
    let persistData = {
      data : action.payload,
      reducer: 'newCars',
      createdAt: new Date(),
    }
    localStorage.set(_.get(persistObj, ['action']), persistData);
  }
  switch (action.type) {
    case FETCH_NEWS:
      return {
        ...state,
        news: action.payload
      }
    case FETCH_CLUB:
      return {
        ...state,
        club: action.payload
      }

    case FETCH_PRICE:
      return {
        ...state,
        price: action.payload
      }

    case FETCH_POPULAR:
      return {
        ...state,
        popular: action.payload
      }

    case FETCH_POPULARCARS:
      return {
        ...state,
        popularCars: action.payload
      }

    case FETCH_CARNAME:
      return {
        ...state,
        CarName: action.payload
      }

    case FETCH_CARDETAILS:
      return {
        ...state,
        details: action.payload
      }

    case FETCH_BRANDS:
      return {
        ...state,
        brands: action.payload
      }

    case FETCH_BRANDDETAIL:
      return {
        ...state,
        brandDetail: action.payload
      }

    case FETCH_BRANDCARS:
      return {
        ...state,
        brandCars: action.payload
      }
    case FETCH_DETAILS:
      return {
        ...state,
        details: action.payload
      }

    case FETCH_FUEL:
      return {
        ...state,
        fuel: action.payload
      }
    case FETCH_FILTERED_COMPARE_DATA:
      return {
        ...state,
        filteredCompareData: action.payload
      }
    case FETCH_COMPARE_NEWCAR_IDS:
      return {
        ...state,
        compareIds: action.payload
      }
    case FETCH_COMPARE__NEWCAR_LIMIT:
      return {
        ...state,
        compareLimit: action.payload
      }
    case ADD_COMPARE_NEWCAR_ID:
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
    case REMOVE_COMPARE_NEWCAR_ID:
      let temp = state.compareIds.filter((item) => item !== action.payload);

      return {
        ...state,
        compareIds: temp,
      }

    case FETCH_PEER_COMPARE_CARS:
      return {
        ...state,
        peerComp: action.payload
      }
    case FETCH_NEW_CAR_FILTER_GROUP:
      return {
        ...state,
        newCarFilterGroup: action.payload
      }
    case RESET_NEW_CAR_FILTER_GROUP:
      return {
        ...state,
        newCarFilterGroup: {
          make: '',
          bodyType: '',
          transmission: '',
          drivenwheel: '',
          seatCapacity: '',
          fuelType: '',
          exterior: '',
          interior: '',
          safety: '',
          priceRange: [],
          monthlyPaymentRange: [],
          engineCapacityRange: [],
        },
      }

    default:
      return state

  }
}
