import { login } from '../../utils/gurushotsApi'
import { getUser, setUser, deleteUser } from '../../utils/setAuthToken'

export const loginUser = (user, password) => dispatch => {
    dispatch({ type: 'LOGIN_REQUEST', payload: null })
    login(user, password).then(res => {
        setUser(res).then(() => {
            dispatch({ type: 'LOGIN_SUCCESS', payload: res })
        }).catch(err => {
            dispatch({ type: 'LOGIN_FAILURE', error: err })
        })
    }).catch(err => {
        dispatch({ type: 'LOGIN_FAILURE', payload: err })
    })

}

export const getCurrentUser = () => dispatch => {
    dispatch({ type: 'LOGIN_REQUEST', payload: null })
    getUser().then(res => {
        console.log(res)
        dispatch({ type: 'LOGIN_SUCCESS', payload: res })
    }).catch(err => {
        dispatch({ type: 'LOGIN_FAILURE', payload: err })
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

