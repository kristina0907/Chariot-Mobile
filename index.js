// /**
//  * @format
//  */

// import {AppRegistry} from 'react-native';
// import App from './App';
// import {name as appName} from './app.json';

//AppRegistry.registerComponent(appName, () => App);

/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

import { createStore, applyMiddleware, compose } from 'redux';
import allReducers from './src/reducers';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';// позволяет передавать в store.dispatch сложные функции

import React from 'react';


//import { fetchAllUsers } from './actions/user';
//import { fetchAllTrips } from './actions/trip';


const store = createStore(allReducers, compose(applyMiddleware(thunk)));


//store.dispatch(fetchAllUsers());
//store.dispatch(fetchAllTrips());

// ReactDOM.render(
//     //чтобы все компоненты app имели доступ к store
//     <Provider store = {store}>
//         <App />
//     </Provider>
//     , document.getElementById('root')
// );

const root = () => (
    <Provider store = {store}>
        <App />
    </Provider>
)
AppRegistry.registerComponent(appName, () => root);
