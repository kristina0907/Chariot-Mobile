//Так как хранилище может принимать только один объект
//создаем allReducers, который будет в себе объединять все преобразователи

import {combineReducers} from 'redux';
import trips from './tripReducer';
import tracks from './trackReducer';
import chariotRentInfo from './chariotReducer';
import transactions from './transactionReducer';
import stationMets from './stationMetReducer';
import stationMet from './currentStationMetReducer';
import metCoordinates from './metCoordinateReducer';
import users from './userReducer';
import logOut from './logOutReducer';
import language from './languageReducer';
import actualTarif from './tarifReducer';



const allReducers = combineReducers({
    trips: trips,  
    tracks: tracks,
    chariotRentInfo: chariotRentInfo,
    transactions:transactions,
    stationMets: stationMets,
    stationMet: stationMet,
    metCoordinates: metCoordinates,
    users:users,
    logOut: logOut,
    language:language,
    actualTarif: actualTarif
});

const rootReducer = (state, action) => {
    // when a logout action is dispatched it will reset redux state
    //|| action.type === 'LANGUAGE'
    if (action.type === 'USER_LOGGED_OUT') {
      state = undefined;
    }
  
    return allReducers(state, action);
  };



export default rootReducer