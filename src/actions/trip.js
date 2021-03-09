import { FETCH_TRIP, ADD_TRIP, EXTEND_TRIP, COMPLETE_TRIP,ERROR_TRIP } from './types';
import axios from 'axios';
import { apiUrl, hubUrl } from './url';
import { authHeader, handleErrorResponse } from '../helpers';
import { Alert } from 'react-native'

export const fetchTrips = (trips) => {
  return {
    type: FETCH_TRIP,
    trips
  }
};

export const fetchAllTrips = (idUser, filter) => {
  const headers = authHeader();
  return (dispatch) => {
      return axios.get(`${apiUrl + "/trips/GetTrips"}`, {
        headers: headers,
        params: {
          idUser: idUser === undefined ? null : idUser,
          filter: filter === undefined ? null : filter
        }
      })
      .then(response => {
        if(response.data.length == 0){
          response.data = 'noTrips'
        }
        dispatch(fetchTrips(response.data))
      })
      .catch(error => {
        throw (error);
      });
  };
};

export const createTrip = ({ idChariot, idUser, dateStart, dateFinish, amountPay, durationPay, idTarif }) => {
  const headers = authHeader();  
  return (dispatch) => {
    return axios.post(apiUrl + "/trips/CreateTrip", { idChariot, idUser, dateStart, dateFinish, amountPay, durationPay, idTarif }, { headers: headers })
      .then(response => {
        if (response.data === "transactionError" || 
            response.data === "userError" || 
            response.data === "commandIsNotRecorded" || 
            response.data === "alreadyRent" || 
            response.data === "lowCharge" || 
            response.data === "notEnoughCash") {
          dispatch(createTripError(response.data))
        }
        else {
          alert("Дождитесь активации транспорта: " + response.data.number);          
          //dispatch(createTripSuccess(response.data))
          dispatch(createTripError(null))
        }
      })
      .catch(error => {
        //throw (error);
        //alert("Ошибка активации: " + error.statusCode);
        dispatch(createTripError("rentError"))
        //alert("Ошибка аренды!");
      });
  };
};

export const createTripSuccess = (data) => {
  return {
    type: ADD_TRIP,
    // payload: {      
    //   idChariot: data.idChariot,
    //   idUser: data.idUser,
    //   dateStart: data.dateStart,
    //   dateFinish: data.dateFinish,
    //   amountPay: data.amountPay,
    //   durationPay: data.durationPay
    // }
  }
};

export const createTripError = (data) => {
  return {
    type: ERROR_TRIP,
    payload:{data: data, time: Date.now() }
  }
  // return {
  //   type: ADD_TRIP,
  //   payload: {
  //     message: data
  //   }
  // }
};

export const extendTrip = ({ idChariot, idUser, dateStart, dateFinish, amountPay, durationPay, idTarif }) => {
  const headers = authHeader();  
  return (dispatch) => {
    return axios.post(apiUrl + "/trips/ExtendTrip", { idChariot, idUser, dateStart, dateFinish, amountPay, durationPay, idTarif }, { headers: headers })
      .then(response => {
        if (response.data === "transactionError" || 
          response.data === "userError" || 
          response.data === "notEnoughToExtend" || 
          response.data === "commandIsNotRecorded" ||
          response.data === "extendIsNotAvailable" ||
          response.data === "notEnoughCash"
          ) {
          //alert(response.data);
          dispatch(extendTripError(response.data))
        }
        else {
          if(response.data === "extendSuccess"){
            alert("Успешно!")
          }
          else{
            alert("Дождитесь продления поездки: " + response.data.number);        
          }
          //dispatch(extendTripSuccess(response.data))
          dispatch(extendTripError(null))
        }
      })
      .catch(error => {
        //throw (error);
          dispatch(extendTripError('extendError'))
        //alert("Ошибка продления!");
      });
  };
};

export const extendTripSuccess = (data) => {
  return {
    type: EXTEND_TRIP,
    // payload: {      
    //   idChariot: data.idChariot,
    //   idUser: data.idUser,
    //   dateStart: data.dateStart,
    //   dateFinish: data.dateFinish,
    //   amountPay: data.amountPay,
    //   durationPay: data.durationPay
    // }
  }
};

export const extendTripError = (data) => {
  return {
    type: ERROR_TRIP,
    payload:{data: data, time: Date.now() }
  }
  // return {
  //   type: ADD_TRIP,
  //   payload: {
  //     message: data
  //   }
  // }
};

export const completeTrip = ({ idChariot, idUser, dateStart, dateFinish, amountPay, durationPay, idTarif }) => {
  const headers = authHeader();  
  return (dispatch) => {
    return axios.post(apiUrl + "/trips/CompleteTrip", { idChariot, idUser, dateStart, dateFinish, amountPay, durationPay, idTarif }, { headers: headers })
      .then(response => {
        if (response.data === "transactionError" ||
          response.data === "userError" ||
          response.data === "outsideTheZone" ||
          response.data === "connectToTheStation" ||
          response.data === "commandIsNotRecorded" ||
          response.data === "completeIsNotAvailable" ||
          response.data === "noCoordinates") {
          //alert(response.data);
          dispatch(completeTripError(response.data))
        }
        else {
          alert("Успешно: " + response.data.number);         
          dispatch(completeTripSuccess(response.data));
          dispatch(completeTripError(null));
        }
      })
      .catch(error => {
        //throw (error);
        dispatch(completeTripError('completeError'))
        //alert("Ошибка дезактивации");
      });
  };
};

export const completeTripSuccess = (data) => {
  return {
    type: COMPLETE_TRIP,
    // payload: {      
    //   idChariot: data.idChariot,
    //   idUser: data.idUser,
    //   dateStart: data.dateStart,
    //   dateFinish: data.dateFinish,
    //   amountPay: data.amountPay,
    //   durationPay: data.durationPay
    // }
  }
};

export const completeTripError = (data) => {
  return {
    type: ERROR_TRIP,
    payload:{data: data, time: Date.now() }
  }
};