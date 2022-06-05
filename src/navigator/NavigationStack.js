import React, { useEffect } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Home from '../screens/Home'
import Login from '../screens/Login'
import { useSelector, useDispatch } from 'react-redux';
import { getCurrentUser, loginUser, logoutUser } from '../store/actions/authActions';
export default function NavigationStack() {
    const dispatch = useDispatch();
    const Stack = createNativeStackNavigator();
    const { auth } = useSelector(state => state);
    const { isAuthenticated, isFetching } = auth;
    console.log(auth)

    useEffect(() => {
        dispatch(logoutUser());
    }, [])

    return (
        <Stack.Navigator>
            {isAuthenticated ? (
                <>
                    <Stack.Screen name="Home" component={Home} />
                </>
            ) :
                (
                    <Stack.Screen name="Login" component={Login} />
                )
            }
        </Stack.Navigator>
    )
}