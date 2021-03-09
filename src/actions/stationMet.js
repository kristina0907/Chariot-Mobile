
import axios from 'axios';
import { authHeader, handleErrorResponse } from '../helpers';
import { FETCH_STATION_MET, FETCH_SELECT_STATION_MET} from './types';
import { apiUrl } from './url';

export const fetchStationMet = (stationMets) => {
    return {
      type: FETCH_STATION_MET,
      stationMets
    }
  };
  
  export const fetchAllStationMet = (idStationMet, filter) => {
    const headers = authHeader();
    return (dispatch) => {
      return axios.get(`${apiUrl + "/stationMets/GetStationMets"}`, {
        headers: headers,
        params: {
          idStationMet: idStationMet === undefined ? null : idStationMet,
          filter: filter === undefined ? null : filter
        }
      })
        .then(response => {
            dispatch(fetchStationMet(response.data))        
        })            
        .catch(error => {
          handleErrorResponse(error.response);
          throw (error);       
        });
    };
  };  

  export const fetchSelectStationMet = (idStationMet, filter) => {
    const headers = authHeader();
    return (dispatch) => {
      return axios.get(`${apiUrl + "/stationMets/GetStationMets"}`, {
        headers: headers,
        params: {
          idStationMet: idStationMet === undefined ? null : idStationMet,
          filter: filter === undefined ? null : filter
        }
      })
        .then(response => {
          dispatch(fetchSelectStationMetSuccess(response.data));      
        })            
        .catch(error => {
          handleErrorResponse(error.response);
          throw (error);       
        });
    };
  };

  export const fetchSelectStationMetSuccess = (stationMet) => {
    return {
      type: FETCH_SELECT_STATION_MET,
      stationMet
    }
  };