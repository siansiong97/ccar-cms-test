import { combineReducers } from 'redux';

import AppReducer from './app-reducer';
import UserReducer from './user-reducer';
import SocketRefreshReducer from './socketRefresh-reducer';
import ProductsListReducer from './productsList-reducer';
import RegisterReducer from './register-reducer';
import NewCarsReducer from './newcars-reducer';
import CarPlatesListReducer from './carPlatesList-reducer';
import SellerProfileReducer from './sellerProfile-reducer';
import kppReducer from './kpp-reducer';
import liveReducer from './live-reducer';
import variantReducer from './variant-reducer';
import userlikesReducer from './userlikes-reducer';
import carfreakReducer from './carfreak-reducer';


const reducers = {
  socketRefresh:SocketRefreshReducer,
  user: UserReducer,
  app: AppReducer,
  productsList: ProductsListReducer,
  register: RegisterReducer,
  newCars: NewCarsReducer,
  variant: variantReducer,
  carPlatesList: CarPlatesListReducer,
  sellerProfile: SellerProfileReducer,
  kpp: kppReducer,
  live: liveReducer,
  userlikes: userlikesReducer,
  carfreak: carfreakReducer,
}

const rootReducer = combineReducers(reducers);

export default rootReducer;
