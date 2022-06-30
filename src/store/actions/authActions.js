import { login } from '../../utils/gurushotsApi'
import { getUser, setUser, deleteUser } from '../../utils/setAuthToken'

export const loginUser = (user, password) => dispatch => {
    dispatch({ type: 'LOGIN_REQUEST', payload: null })
    login(user, password).then(res => {
        if (res.success) {
            setUser(res).then(() => {
                dispatch({ type: 'LOGIN_SUCCESS', payload: res })
            }).catch(err => {
                dispatch({ type: 'LOGIN_FAILURE', error: err })
            })
        } else {
            dispatch({ type: 'LOGIN_FAILURE', error: res.message })
        }
    }).catch(err => {
        dispatch({ type: 'LOGIN_FAILURE', payload: err })
    })
}

export const getCurrentUser = () => dispatch => {
    dispatch({ type: 'LOGIN_REQUEST', payload: null })
    return getUser().then(res => {
        if (res) {
            return dispatch({ type: 'LOGIN_SUCCESS', payload: res })
        } else {
            return dispatch({ type: 'LOGIN_FAILURE', payload: null })
        }
    }).catch(err => {
        return dispatch({ type: 'LOGIN_FAILURE', payload: err })
    })
}

export const logoutUser = () => dispatch => {
    deleteUser()
        .then(() => {
            dispatch({ type: 'LOGOUT' })
        })
        .catch(err => {
            console.log(err)
        })
}

