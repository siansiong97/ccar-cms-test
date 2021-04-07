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
import { checkIsNeedPersist, checkNeedPersist, getPersistObj, persistRedux } from '../config';

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

  // checkNeedPersist(_.get(action, 'type'), 'newCars', _.get(action, 'payload'), _.get(action, 'isRestoreData'));

  let persistStates = _.get(localStorage.get('redux') || {}, 'newCars') || INITIAL_STATE;
  state = {
    ...state,
    ...persistStates,
  }
  switch (action.type) {
    case FETCH_NEWS:
      state = {
        ...state,
        news: action.payload
      }
      break;
    case FETCH_CLUB:
      state = {
        ...state,
        club: action.payload
      }
      break;

    case FETCH_PRICE:
      state = {
        ...state,
        price: action.payload
      }
      break;

    case FETCH_POPULAR:
      state = {
        ...state,
        popular: action.payload
      }
      break;

    case FETCH_POPULARCARS:
      state = {
        ...state,
        popularCars: action.payload
      }

    case FETCH_CARNAME:
      state = {
        ...state,
        CarName: action.payload
      }
      break;

    case FETCH_CARDETAILS:
      state = {
        ...state,
        details: action.payload
      }
      break;

    case FETCH_BRANDS:
      state = {
        ...state,
        brands: action.payload
      }
      break;

    case FETCH_BRANDDETAIL:
      state = {
        ...state,
        brandDetail: action.payload
      }
      break;

    case FETCH_BRANDCARS:
      state = {
        ...state,
        brandCars: action.payload
      }
      break;
    case FETCH_DETAILS:
      state = {
        ...state,
        details: action.payload
      }
      break;

    case FETCH_FUEL:
      state = {
        ...state,
        fuel: action.payload
      }
      break;
    case FETCH_FILTERED_COMPARE_DATA:
      state = {
        ...state,
        filteredCompareData: action.payload
      }
      break;
    case FETCH_COMPARE_NEWCAR_IDS:
      state = {
        ...state,
        compareIds: action.payload
      }
      break;
    case FETCH_COMPARE__NEWCAR_LIMIT:
      state = {
        ...state,
        compareLimit: action.payload
      }
      break;
    case ADD_COMPARE_NEWCAR_ID:
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
    case REMOVE_COMPARE_NEWCAR_ID:
      let temp = state.compareIds.filter((item) => item !== action.payload);

      state = {
        ...state,
        compareIds: temp,
      }
      break;

    case FETCH_PEER_COMPARE_CARS:
      state = {
        ...state,
        peerComp: action.payload
      }
      break;
    case FETCH_NEW_CAR_FILTER_GROUP:
      state = {
        ...state,
        newCarFilterGroup: action.payload
      }
      break;
    case RESET_NEW_CAR_FILTER_GROUP:
      state = {
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
      break;

    default:
      state = state
      break;

  }

  persistRedux('newCars', state)
  return state;
}
