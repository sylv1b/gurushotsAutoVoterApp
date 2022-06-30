import authReducer from './authReducer';

// export default store;
import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import thunk from 'redux-thunk';

const rootReducer = combineReducers({
    auth: authReducer,
});

let composeEnhancers = compose();

if (__DEV__) {
    composeEnhancers = (applyMiddleware(thunk),
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose);
}

// use applyMiddleware to add the thunk middleware to the store
const store = createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(thunk)),
);

export default store;
