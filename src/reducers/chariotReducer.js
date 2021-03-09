import { FETCH_CHARIOT_RENT_INFO,ERROR_TRIP } from '../actions/types';

const initialState = {
    data: [],
    error: null
}

export default function chariotReducer(state = initialState, action) {
    switch (action.type) {        
        case FETCH_CHARIOT_RENT_INFO:
            return {...state, data: action.chariotRentInfo};     
        case ERROR_TRIP:
            return {...state, error: action.payload}     
        default:
            return state;
    }
}