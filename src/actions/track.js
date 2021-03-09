import { FETCH_TRACK_COORDINATES, FETCH_MET_COORDINATES } from './types';
import axios from 'axios';
import { apiUrl } from './url';
import { authHeader, handleErrorResponse } from '../helpers';


export const fetchTrackCoordinates = (tracks) => {
  return {
    type: FETCH_TRACK_COORDINATES,
    tracks
  }
};

export const fetchAllTrackCoordinates = (idTrip) => {
  return (dispatch) => {
    return axios.get(`${apiUrl + "/tracks"}/${idTrip===undefined ? '' : idTrip}`)
      .then(response => {              
        dispatch(fetchTrackCoordinates(Object.keys(response.data).map(
          function(k){
                      return {latitude: response.data[k].latitude, longitude: response.data[k].longitude}
                            })))
          // function(k){
          //   return [response.data[k].latitude, response.data[k].longitude]
          //         })))
      })
      .catch(error => {
        throw (error);
      });
  };
};

export const fetchMetCoordinates = (metCoordinates) => {
  return {
    type: FETCH_MET_COORDINATES,
    metCoordinates
  }
};

export const fetchAllMetCoordinates = (idUser) => {
  const headers = authHeader();
  return (dispatch) => {
    return axios.get(`${apiUrl + "/tracks/GetPositionReadyMet"}`, {
      params: {
          id: idUser,
      }
    },
    { headers: headers })
      .then(response => {
          dispatch(fetchMetCoordinates(response.data))        
      })            
      .catch(error => {
        handleErrorResponse(error.response);
        throw (error);       
      });
  };
};  