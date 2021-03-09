import { USER_LOGGED_OUT } from '../actions/types';

export default function logOutReducer(state = [], action) {
    switch (action.type) {       
        case USER_LOGGED_OUT:
            return action.type;   
        default:
            return state;
    }
}
