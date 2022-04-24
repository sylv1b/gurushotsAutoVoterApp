import { View, Text, Image, Appearance, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import moment from 'moment'
import { getVoteImages, submitVotes } from '../utils/gurushotsApi'


export default function ChallengeCard({ challenge, forceRefresh }) {

    const [isVoting, setIsVoting] = useState(false)

    const colorScheme = Appearance.getColorScheme();
    const isDark = colorScheme === 'dark';

    const { id, member } = challenge.image
    const memberScore = challenge.member.ranking.total

    const needVote = challenge.member.ranking.exposure.exposure_factor < 100

    const { boost } = challenge.member
    const boostAvailable = boost.state === 'AVAILABLE' && boost.timeout

    const vote = async () => {
        setIsVoting(true)
        const voteImages = await getVoteImages(challenge)
        submitVotes(voteImages).then((res) => {
            forceRefresh(true)
            setIsVoting(false)
        })
    }

    return (
        <View>
            <View style={{ flexDirection: 'row', backgroundColor: needVote ? '#efcf4c' : isDark ? 'black' : 'white' }} >
                <Image source={{ uri: `https://photos.gurushots.com//unsafe/500x500/${member.id}/3_${id}.jpg` }} style={{ width: 116, height: 116, marginRight: 10 }} />
                <View style={{ padding: 16, borderColor: boostAvailable ? 'green' : 'white', borderWidth: boostAvailable ? 2 : 0 }}>
                    <Text style={{ fontWeight: 'bold', color: isDark ? 'white' : 'black' }}>{challenge.title}</Text>
                    <Text style={{ fontSize: 12, color: isDark ? 'white' : 'black' }}>Exposure factor: {challenge.member.ranking.exposure.exposure_factor}</Text>
                    <Text style={{ fontSize: 12, color: isDark ? 'white' : 'black' }}>Rank: {memberScore.level_name} ({memberScore.next_message})</Text>
                    <Text style={{ fontSize: 12, color: isDark ? 'white' : 'black' }}>Ends at: {moment.unix(challenge.close_time).format('YYYY-MM-DD HH:MM')}</Text>
                    <Text style={{ fontSize: 12, color: isDark ? 'white' : 'black' }}>Your score: {memberScore.votes} votes</Text>
                </View>

                {challenge.member.ranking.exposure.exposure_factor < 100 && <TouchableOpacity
                    onPress={() => vote()}
                    style={{
                        position: 'absolute',
                        right: 4,
                        bottom: 4,
                        padding: 4,
                        backgroundColor: 'green',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 4
                    }}
                    disabled={isVoting}>
                    <Text style={{ color: 'white', fontSize: 8 }}>Vote </Text>
                </TouchableOpacity>}

            </View>
        </View >
    )
}