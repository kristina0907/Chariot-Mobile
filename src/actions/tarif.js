
import axios from 'axios';
import { authHeader, handleErrorResponse } from '../helpers';
import { FETCH_ACTUAL_TARIF} from './types';
import { apiUrl } from './url';


  export const fetchActualTarif = (metTypeCode) => {
    const headers = authHeader();
    return (dispatch) => {
      return axios.get(`${apiUrl + "/tariffs/GetActualTarif"}`, {
        headers: headers,
        params: {
          metTypeCode: metTypeCode          
        }
      })
        .then(response => {
          dispatch(fetchActualTarifSuccess(response.data));      
        })            
        .catch(error => {
          handleErrorResponse(error.response);
          throw (error);       
        });
    };
  };

  export const fetchActualTarifSuccess = (actualTarif) => {
    return {
      type: FETCH_ACTUAL_TARIF,
      actualTarif
    }
  };