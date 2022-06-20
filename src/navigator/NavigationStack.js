import React, { useEffect, useState } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Home from '../screens/Home'
import Login from '../screens/Login'
import { useSelector, useDispatch } from 'react-redux';
import { getCurrentUser, logoutUser } from '../store/actions/authActions';
import colors from '../styles/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
export default function NavigationStack() {
    const dispatch = useDispatch();
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
                                backgroundColor: colors.isabelline,
                            }, headerTitleStyle: {
                                color: colors.text,
                            },
                            headerRight: () => (
                                <Icon.Button
                                    name="exit-to-app"
                                    size={25}
                                    color='black'
                                    onPress={() => {
                                        dispatch(logoutUser())
                                    }}
                                    backgroundColor={colors.isabelline}
                                />
                            ),
                        }} />
                </>
            ) :
                (
                    <Stack.Screen name="Login" component={Login} options={{
                        // hide header
                        headerShown: false,
                    }} />
                )
            }
        </Stack.Navigator>
    )
}