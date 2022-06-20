import { View, Dimensions, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import {
    TextField,
    Button
} from '../components/shared'
import colors from '../styles/colors'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser } from '../store/actions/authActions'

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
                }}
                onLayout={(event) => {
                    const { y, } = event.nativeEvent.layout
                    setFormPosition(y)
                }}
            >
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
                {isFetching && <ActivityIndicator
                    style={{
                        position: 'absolute',
                        top: - formPosition - 40,
                        left: 0,
                        right: 0,
                        bottom: 0,
                    }}
                    size="large"
                    color={colors.vividTangerine}
                />}
            </View>
        </View>
    )
}