const initialState = {
    isAuthenticated: false,
    user: {},
    isFetching: false,
    error: ''
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'LOGIN_REQUEST':
            return {
                ...state,
                isFetching: true
            };
        case 'LOGIN_SUCCESS':
            return {
                ...state,
                isFetching: false,
                isAuthenticated: true,
                user: action.payload,
            };
        case 'LOGIN_FAILURE':
            return {
                ...state,
                isFetching: false,
                isAuthenticated: false,
                error: action.error
            };
        case 'LOGOUT':
            return initialState;
        default:
            return state;
    }
}

export default authReducer;