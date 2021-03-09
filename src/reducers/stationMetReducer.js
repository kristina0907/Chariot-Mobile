import { FETCH_STATION_MET} from '../actions/types';

export default function stationMetReducer(state = [], action) {
    switch (action.type) {  
            case FETCH_STATION_MET:
                return action.stationMets; 
        default:
            return state;
    }
}
