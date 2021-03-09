import { FETCH_TRACK_COORDINATES } from '../actions/types';

export default function trackReducer(state = [], action) {
    switch (action.type) {        
        case FETCH_TRACK_COORDINATES:
            return action.tracks;        
        default:
            return state;
    }
}