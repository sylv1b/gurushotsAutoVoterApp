import { View, Text, TextInput } from 'react-native'
import React from 'react'
import colors from '../../../styles/colors'

const TextField = ({
    title,
    value,
    color,
    onChange,
    placeholder,
    secureTextEntry,
    keyboardType,
    error }) => {
    return (
        <View style={{ margin: 10 }}>
            <Text style={{
                marginBottom: 6
            }}>{title}</Text>
            <TextInput
                value={value.toLowerCase()}
                onChangeText={onChange}
                placeholder={placeholder}
                secureTextEntry={secureTextEntry}
                keyboardType={keyboardType}
                style={{
                    backgroundColor: color,
                    height: 50,
                    borderColor: colors.brownSugar,
                    borderWidth: 1,
                    borderRadius: 4,
                    padding: 5,
                    color: colors.text
                }}
            />
            {error && <Text style={{ color: 'red' }}>{error}</Text>}
        </View>
    )
}

export default TextField