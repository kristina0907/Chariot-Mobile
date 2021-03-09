import { FETCH_MET_COORDINATES } from '../actions/types';

export default function metCoordinateReducer(state = [], action) {
    switch (action.type) {
        case FETCH_MET_COORDINATES:
            return action.metCoordinates;               
        default:
            return state;
    }
}