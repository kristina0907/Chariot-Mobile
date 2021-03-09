import { LANGUAGE } from './types';
import { authenticationService } from '../services';

export const translateLanguage = (language) => {
    return (dispatch) => {
        authenticationService.getLanguage(language);
        dispatch(languageSuccess());   
    };
};

export const languageSuccess = () => {
    return {
        type: LANGUAGE
    }
};