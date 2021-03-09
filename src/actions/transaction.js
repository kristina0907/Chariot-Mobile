import { FETCH_TRANSACTION } from './types';
import axios from 'axios';
import { authHeader, handleErrorResponse } from '../helpers';
import { apiUrl } from './url';

export const fetchTransactions = (transactions) => {
  return {
    type: FETCH_TRANSACTION,
    transactions
  }
};

export const fetchAllTransactions = (idUser, filter) => {
  const headers = authHeader();
  return (dispatch) => {
    return axios.get(`${apiUrl + "/transactions/GetTransactions"}`, {
      headers: headers,
      params: {
        idUser: idUser === undefined ? null : idUser,
        filter: filter === undefined ? null : filter
      }
    })
      .then(response => {
        if (response.data.length == 0) {
          response.data = 'noTransactions'
        }
        dispatch(fetchTransactions(response.data))
      })
      .catch(error => {
        handleErrorResponse(error.response);
        throw (error);
      });
  };
};
