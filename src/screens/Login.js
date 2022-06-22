import { View, Dimensions, Text } from 'react-native'
import React, { useState } from 'react'
import {
    TextField,
    Button
} from '../components/shared'
import colors from '../styles/colors'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser } from '../store/actions/authActions'
import LoadingOverlay from '../components/shared/LoadingOverlay/LoadingOverlay'

export default function Login() {
    const dispatch = useDispatch()
    const {
        error,
        isFetching,
    } = useSelector(state => state.auth)
    const { width, height } = Dimensions.get('window')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [formPosition, setFormPosition] = useState(0)

    const onButtonPressed = () => {
        dispatch(loginUser(email, password))
    }

    return (
        <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.isabelline,
        }}>
            <View
                style={{
                    width: width - 18,
                    height: width - 18,
                    justifyContent: 'center',
                }}
                onLayout={(event) => {
                    const { y, } = event.nativeEvent.layout
                    setFormPosition(y)
                }}
            >
                <Text style={{ textAlign: 'center', marginBottom: 30, fontSize: 18 }}>Login with your Gurushots credentials</Text>

                <TextField
                    title="Email"
                    value={email}
                    onChange={setEmail}
                    placeholder="Enter your email"
                    keyboardType="email-address"
                    color={colors.isabelline}
                    error={error ? 'Check your email' : null}
                />
                <TextField
                    title="Password"
                    value={password}
                    onChange={setPassword}
                    placeholder="Enter your password"
                    secureTextEntry={true}
                    keyboardType="default"
                    color={colors.isabelline}
                    error={error ? 'Check your password' : null}
                />
                <Button
                    text="Login"
                    onPress={onButtonPressed}
                    color='black'
                    disabled={isFetching}
                    hideIcon
                />

            </View>
            {isFetching && <LoadingOverlay />}
        </View>
    )
}