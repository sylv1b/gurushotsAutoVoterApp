import { View, Text, Image, Appearance } from 'react-native'
import React from 'react'
import moment from 'moment'


export default function ChallengeCard({ challenge }) {

    const colorScheme = Appearance.getColorScheme();
    const isDark = colorScheme === 'dark';

    const { id, member } = challenge.image
    const memberScore = challenge.member.ranking.total

    const needVote = challenge.member.ranking.exposure.exposure_factor < 100

    const boostState = challenge.member.boost.state
    const boostAvailable = boostState !== 'USED' && boostState !== 'EXPIRED' && boostState !== 'LOCKED'

    return (
        <View style={{ flexDirection: 'row', backgroundColor: needVote ? '#efcf4c' : isDark ? 'black' : 'white' }} >
            <Image source={{ uri: `https://photos.gurushots.com//unsafe/500x500/${member.id}/3_${id}.jpg` }} style={{ width: 116, height: 116, marginRight: 10 }} />
            <View style={{ padding: 16, borderColor: boostAvailable ? 'green' : 'white', borderWidth: boostAvailable ? 2 : 0 }}>
                <Text style={{ fontWeight: 'bold', color: isDark ? 'white' : 'black' }}>{challenge.title}</Text>
                <Text style={{ fontSize: 12, color: isDark ? 'white' : 'black' }}>Exposure factor: {challenge.member.ranking.exposure.exposure_factor}</Text>
                <Text style={{ fontSize: 12, color: isDark ? 'white' : 'black' }}>Rank: {memberScore.level_name} ({memberScore.next_message})</Text>
                <Text style={{ fontSize: 12, color: isDark ? 'white' : 'black' }}>Ends at: {moment.unix(challenge.close_time).format('YYYY-MM-DD HH:MM')}</Text>
                <Text style={{ fontSize: 12, color: isDark ? 'white' : 'black' }}>Your score: {memberScore.votes} votes</Text>
            </View>
        </View>
    )
}