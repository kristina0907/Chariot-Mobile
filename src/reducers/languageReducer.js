import { LANGUAGE } from '../actions/types';

export default function languageReducer(state = [], action) {
    switch (action.type) {       
        case LANGUAGE:
            return action.type;   
        default:
            return state;
    }
}