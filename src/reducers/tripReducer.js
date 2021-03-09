import { FETCH_TRIP, ADD_TRIP,ERROR_TRIP } from '../actions/types';

const initialState = {
    data: [],
    error: null
}

export default function tripReducer(state = initialState, action) {
    switch (action.type) {
        // case ADD_TRIP:
        //     return [...state, action.payload];        
        case FETCH_TRIP:
            return {...state, data: action.trips}; 
        case ERROR_TRIP:
            return {...state, error: action.payload}          
        default:
            return state;
    }
}
// import { FETCH_TRIP, ADD_TRIP } from '../actions/types';

// export default function tripReducer(state = [], action) {
//     switch (action.type) {
//         // case ADD_TRIP:
//         //     return [...state, action.payload];        
//         case FETCH_TRIP:
//             return action.trips;        
//         default:
//             return state;
//     }
// }
