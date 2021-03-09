import { USER_LOGGED_OUT } from './types';
import { authenticationService } from '../services';

export const userLogout = () => {
    return (dispatch) => {
        authenticationService.logout();
        dispatch(logoutSuccess());   
    };
};

export const logoutSuccess = () => {
    return {
        type: USER_LOGGED_OUT
    }
};
