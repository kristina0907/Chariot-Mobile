import { FETCH_ACTUAL_TARIF } from '../actions/types';

export default function chariotReducer(state = [], action) {
    switch (action.type) {        
        case FETCH_ACTUAL_TARIF:
            return action.actualTarif;        
        default:
            return state;
    }
}