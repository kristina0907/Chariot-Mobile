import { FETCH_TRANSACTION, DEPOSIT_ACCOUNT } from '../actions/types';

export default function transactionReducer(state = [], action) {
    switch (action.type) {
        case FETCH_TRANSACTION:
            return action.transactions;
        case DEPOSIT_ACCOUNT:
            return [...state, action.payload]; 
        default:
            return state;
    }
}