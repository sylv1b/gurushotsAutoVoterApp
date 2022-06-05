import { View, Text, Dimensions } from 'react-native'
import React from 'react'

export default function Login() {
    const { width, height } = Dimensions.get('window')
    return (
        <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <View style={{
                width: width - 18,
                height: width - 18,
                borderRadius: 4,
                borderColor: '#ddd',
                borderWidth: 1,
                shadowColor: '#000',
                shadowOffset: { width: 2, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 6,
                elevation: 1,
                backgroundColor: '#fff',
            }}>

            </View>
        </View>
    )
}