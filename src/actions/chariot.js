
import axios from 'axios';
//import { authHeader, handleErrorResponse } from '../helpers';
import { FETCH_CHARIOT_RENT_INFO,ERROR_TRIP } from './types';
import { apiUrl } from './url';

export const fetchChariotRentInfo = (chariotRentInfo) => {
    return {
        type: FETCH_CHARIOT_RENT_INFO,
        chariotRentInfo
    }
};

export const fetchAllChariotRentInfo = (params) => {
    //const headers = authHeader();
    return (dispatch) => {
        return axios.get(`${apiUrl + "/Chariots/GetChariotRentInfo"}`, {
            params: {
                idUser: params.idUser,
                number: params.number
            }
        })
            .then(response => {
                dispatch(fetchChariotRentInfo(response.data));
                dispatch(ChariotError("skanChariot"));
            })
            .catch(error => {
                //handleErrorResponse(error.response);
                throw (error);
            });
    };
};    

export const ChariotError = (data) => {
    return {
      type: ERROR_TRIP,
      payload:{data: data, time: Date.now() }
    }
  };