import { FETCH_USER,DEPOSIT_ACCOUNT, UPDATE_USER,UPDATE_PASSWORD,ERROR_PASSWORD } from './types';
import axios from 'axios';
import { authHeader, handleErrorResponse } from '../helpers';
import { apiUrl } from './url';

export const fetchUsers = (users) => {
  return {
    type: FETCH_USER,
    users
  }
};

export const fetchAllUsers = (idUser, filter) => {
  const headers = authHeader();
  return (dispatch) => {
    return axios.get(`${apiUrl + "/users/GetUsers"}`, {
      headers: headers,
      params: {
        idUser: idUser === undefined ? null : idUser,
        filter: filter === undefined ? null : filter
      }
    })
      .then(response => {
        dispatch(fetchUsers(response.data));      
      })            
      .catch(error => {
        handleErrorResponse(error.response);
        throw (error);       
      });
  };
};

export const depositAccount = ({ idUser, depositAmount }) => {
  const headers = authHeader();
  return (dispatch) => {
    return axios.post(apiUrl + "/users/DepositAccount", { idUser, depositAmount }, { headers: headers })
      .then(response => {
        dispatch(depositAccountSuccess(response.data))
        alert("Баланс пополнен");
      })
      .catch(error => {
        throw (error);
      });
  };
};

export const depositAccountSuccess = (data) => {
  return {
    type: DEPOSIT_ACCOUNT,
    payload: {
      amount: data.amount,
      date: data.date,
      idTransactionType: data.idTransactionType,
      idTransacttion: data.idTransacttion,
      idUser: data.idUser,
      idUserTrip: data.idUserTrip,
      isVerify: data.isVerify,
      transactionType: data.transactionType,
      transactionTypeFK: data.transactionTypeFK,
      userAccountNumber: data.userAccountNumber,
      userName: data.userName,
      userSurName: data.userSurName
    }
  }
};
export const updateUser = ({ idUser, name, surName, birtDate, phone, email}) => {
  const headers = authHeader();
  return (dispatch) => {
    return axios.post(apiUrl + "/users/UpdateUser", { idUser, name, surName, birtDate, phone, email }, { headers: headers })
      .then(response => {
          dispatch(updateUserSuccess(response.data));
          alert("Данные изменены");  
      })
      .catch(error => {
        throw (error);
      });
  };
};

export const updateUserSuccess = (data) => {
  return {
    idUser: data.idUser,
    type: UPDATE_USER,
    payload: {
      name: data.name,
      surName: data.surName,
      birtDate: data.birtDate,
      login: data.login,
      phone: data.phone,
      email: data.email,
    }
  }
};


export const updatePassword = ({idUser, oldPassword, newPassword}) => {
  const headers = authHeader();
  return (dispatch) => {
    return axios.post(apiUrl + "/users/UpdatePassword", { idUser, oldPassword, newPassword }, { headers: headers })
      .then(response => {
        if (response.data === "oldPasswordIsIncorrect"){
          //alert("Старый пароль неверный");
          dispatch(updatePasswordError(response.data))
        }
        else{
          //dispatch(updatePasswordSuccess(response.data));
          dispatch(updatePasswordError(null))
          alert("Пароль изменен");
        }
      })
      .catch(error => {
        throw (error);
      });
  };
};

export const changePassword = ({idUser, newPassword}) => {
  const headers = authHeader();
  return (dispatch) => {
    return axios.post(apiUrl + "/auth/ChangePassword", { idUser, newPassword }, { headers: headers })
      .then(response => {    
          dispatch(changePasswordSuccess(response.data))  
          alert("Пароль изменен");
      })
      .catch(error => {
        throw (error);
      });
  };
};

export const changePasswordSuccess = (data) => {
  return {
    type: UPDATE_PASSWORD,   
  }
};

export const updatePasswordSuccess = (data) => {
  return {
    idUser: data.idUser,
    type: UPDATE_PASSWORD,
    payload: {
      oldPassword: data.oldPassword,
      newPassword: data.newPassword,
    }
  }
};

export const updatePasswordError = (data) => {
  return {
    type: ERROR_PASSWORD,
    payload:{data: data, time: Date.now() }
  }
};

