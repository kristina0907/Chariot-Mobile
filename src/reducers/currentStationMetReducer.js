import { FETCH_STATION_MET, FETCH_SELECT_STATION_MET} from '../actions/types';

export default function stationMetReducer(state = [], action) {
    switch (action.type) {              
            case FETCH_SELECT_STATION_MET:
                return action.stationMet;      
        default:
            return state;
    }
}
