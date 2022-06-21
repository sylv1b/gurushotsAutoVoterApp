import { ActivityIndicator, View, Text } from 'react-native'
import React from 'react'

export default function LoadingOverlay({ visible = true, text }) {
  return visible &&
    <View style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <ActivityIndicator
        size="large"
        color='white'
      />
      {text && <Text style={{
        color: 'white',
        fontSize: 16,
        marginTop: 30
      }}>{text}</Text>}
    </View>

}