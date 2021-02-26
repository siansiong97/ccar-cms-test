import { createStore, applyMiddleware, combineReducers } from 'redux'
import { HYDRATE, createWrapper } from 'next-redux-wrapper'
import thunkMiddleware from 'redux-thunk'
import app from '../redux/reducers/app-reducer'
import carfreak from '../redux/reducers/carfreak-reducer'
import carPlatesList from '../redux/reducers/carPlatesList-reducer'
import kpp from '../redux/reducers/kpp-reducer'
import live from '../redux/reducers/live-reducer'
import newcars from '../redux/reducers/newcars-reducer'
import productsList from '../redux/reducers/productsList-reducer'
import register from '../redux/reducers/register-reducer'
import sellerProfile from '../redux/reducers/sellerProfile-reducer'
import socketRefresh from '../redux/reducers/socketRefresh-reducer'
import user from '../redux/reducers/user-reducer'
import userlikes from '../redux/reducers/userlikes-reducer'
import variant from '../redux/reducers/variant-reducer'

// import AppReducer from './app-reducer';
// import UserReducer from './user-reducer';
// import SocketRefreshReducer from './socketRefresh-reducer';
// import ProductsListReducer from './productsList-reducer';
// import RegisterReducer from './register-reducer';
// import NewCarsReducer from './newcars-reducer';
// import CarPlatesListReducer from './carPlatesList-reducer';
// import SellerProfileReducer from './sellerProfile-reducer';
// import kppReducer from './kpp-reducer';
// import liveReducer from './live-reducer';
// import variantReducer from './variant-reducer';
// import userlikesReducer from './userlikes-reducer';
// import carfreakReducer from './carfreak-reducer';



const bindMiddleware = (middleware) => {
  if (process.env.NODE_ENV !== 'production') {
    const { composeWithDevTools } = require('redux-devtools-extension')
    return composeWithDevTools(applyMiddleware(...middleware))
  }
  return applyMiddleware(...middleware)
}

const combinedReducer = combineReducers({
  app,
  carfreak,
  carPlatesList,
  kpp,
  live,
  newcars,
  productsList,
  register,
  sellerProfile,
  socketRefresh,
  user,
  userlikes,
  variant,
})

const reducer = (state, action) => {
  if (action.type === HYDRATE) {
    const nextState = {
      ...state, // use previous state
      ...action.payload, // apply delta from hydration
    }
    if (state.count.count) nextState.count.count = state.count.count // preserve count value on client side navigation
    return nextState
  } else {
    return combinedReducer(state, action)
  }
}

const initStore = () => {
  return createStore(reducer, bindMiddleware([thunkMiddleware]))
}



export const wrapper = createWrapper(initStore)
