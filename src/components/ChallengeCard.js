import { View, Text, Image, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import moment from 'moment'
import { getVoteImages, submitVotes } from '../utils/gurushotsApi'
import colors from '../styles/colors'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

const { width } = Dimensions.get('window')


export default function ChallengeCard({ challenge, forceRefresh }) {
    const MARGIN = 8
    const WIDTH = width - (MARGIN * 2)
    const { entries } = challenge.member.ranking

    console.log('ChallengeCard', challenge)

    const [isVoting, setIsVoting] = useState(false)

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
        <View style={{
            marginHorizontal: MARGIN,
            marginVertical: 5,
            borderRadius: 8,
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 2
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
            overflow: 'hidden',
            backgroundColor: 'white',
            borderColor: needVote ? 'red' : 'white',
            borderWidth: 3

        }}>
            {challenge.member.ranking.exposure.exposure_factor < 100 && <View style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 200, zIndex: 10, justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity
                    style={{
                        width: 100,
                        height: 100,
                        borderRadius: 50,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: 40,
                        borderColor: 'white',
                        borderWidth: 1
                    }}
                    onPress={() => vote()}
                    disabled={isVoting}
                >
                    {isVoting ? <ActivityIndicator /> : <Icon name='vote-outline' size={60} color='white' />}
                    {!isVoting && <Text style={{ color: 'white' }}>Vote</Text>}
                </TouchableOpacity>
            </View>}
            <View>
                <Image source={{ uri: `https://photos.gurushots.com/unsafe/500x500/${member.id}/3_${id}.jpg` }} style={{ width: '100%', height: 200 }} />
                <View style={{ position: 'absolute', top: 0, left: 0, width: WIDTH, height: 40, padding: 6, backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <Text style={{ fontWeight: 'bold', color: colors.isabelline }}>{challenge.title}</Text>
                    <Text style={{ fontSize: 9, color: colors.isabelline }}>by guru {challenge.guru_info.name} ({challenge.guru_info.member_status_name})</Text>
                </View>
            </View>
            <View style={{ flexDirection: 'row', borderBottomLeftRadius: 2, borderBottomRightRadius: 2, overflow: 'hidden' }}>
                {entries.map((entry, index) => (
                    <View key={entry.id} style={{
                        borderColor: 'white',
                        borderRightWidth: index === entries.length - 1 ? 0 : 1,
                        borderBottomLeftRadius: index === 0 ? 4 : 0,
                        borderBottomRightRadius: index === entries.length - 1 ? 4 : 0,
                        borderTopWidth: 1,
                        overflow: 'hidden',
                    }}>
                        <Image
                            source={{ uri: `https://photos.gurushots.com/unsafe/500x500/${entry.member_id}/3_${entry.id}.jpg` }}
                            style={{
                                width: (WIDTH - ((entries.length - 1) + 6)) / 4,
                                height: (WIDTH) / 4,
                            }}
                        />
                        <View
                            style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                width: (WIDTH / 4),
                                padding: 4,
                                backgroundColor: 'rgba(0,0,0,0.5)'
                            }}>
                            <Text style={{ fontSize: 9, color: colors.isabelline }}>Rank {entry.rank}</Text>
                            <Text style={{ fontSize: 9, color: colors.isabelline }}>{entry.votes} votes</Text>
                        </View>
                    </View>
                ))}
            </View>
            <View style={{ flexDirection: 'row', }} >
                <View style={{ padding: 8, borderColor: boostAvailable ? 'green' : 'white', borderWidth: boostAvailable ? 2 : 0 }}>
                    <Text style={{ fontSize: 12, color: colors.text }}>Exposure factor: {challenge.member.ranking.exposure.exposure_factor}</Text>
                    <Text style={{ fontSize: 12, color: colors.text }}>Rank: {memberScore.level_name} ({memberScore.next_message})</Text>
                    <Text style={{ fontSize: 12, color: colors.text }}>Ends at: {moment.unix(challenge.close_time).format('YYYY-MM-DD HH:MM')}</Text>
                    <Text style={{ fontSize: 12, color: colors.text }}>Your score: {memberScore.votes} votes</Text>
                </View>
            </View>
        </View >
    )
}