import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import colors from '../../../styles/colors'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

const Button = ({ text, onPress, color, disabled, hideIcon }) => {
    return (
        <TouchableOpacity
            onPress={() => onPress()}
            style={{
                backgroundColor: color,
                borderRadius: 4,
                borderColor: 'white',
                borderWidth: 1,
                shadowColor: '#000',
                shadowOffset: { width: 2, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 6,
                elevation: 1,
                padding: 20,
                margin: 10,
                alignItems: 'center',
                //height: 50,
                justifyContent: 'center'

            }}
            disabled={disabled}
        >
            {!hideIcon && <Icon name='vote-outline' size={40} color='white' />}
            <Text
                style={{
                    color: colors.isabelline,
                    fontSize: 16,
                    fontWeight: 'bold',
                }}
            >{text}</Text>
        </TouchableOpacity>
    )
}

export default Button