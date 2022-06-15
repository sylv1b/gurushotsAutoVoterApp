import React, { useEffect, useState } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Home from '../screens/Home'
import Login from '../screens/Login'
import { useSelector, useDispatch } from 'react-redux';
import { getCurrentUser, loginUser, logoutUser } from '../store/actions/authActions';
import { Appearance } from 'react-native'
import colors from '../styles/colors';
export default function NavigationStack() {
    const dispatch = useDispatch();
    const colorScheme = Appearance.getColorScheme();
    const isDark = colorScheme === 'dark';
    const [isReady, setIsReady] = useState(false);
    const Stack = createNativeStackNavigator();
    const { auth } = useSelector(state => state);
    const { isAuthenticated, isFetching } = auth;

    useEffect(() => {
        if (!isReady) {
            dispatch(getCurrentUser()).then(() => setIsReady(true));
        }
    }, [])

    return isReady && (
        <Stack.Navigator>
            {isAuthenticated ? (
                <>
                    <Stack.Screen
                        name="Home"
                        component={Home}
                        options={{
                            headerTitle: 'Your challenges',
                            headerStyle: {
                                backgroundColor: isDark ? colors.lightGrey : colors.isabelline,
                            }, headerTitleStyle: {
                                color: isDark ? colors.isabelline : colors.text,
                            }
                        }} />
                </>
            ) :
                (
                    <Stack.Screen name="Login" component={Login} />
                )
            }
        </Stack.Navigator>
    )
}