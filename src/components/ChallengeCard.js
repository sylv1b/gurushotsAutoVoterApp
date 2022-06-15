import { View, Text, Image, Appearance, TouchableOpacity, Dimensions } from 'react-native'
import React, { useState } from 'react'
import moment from 'moment'
import { getVoteImages, submitVotes } from '../utils/gurushotsApi'
import colors from '../styles/colors'

const { width } = Dimensions.get('window')


export default function ChallengeCard({ challenge, forceRefresh }) {
    const MARGIN = 8
    const WIDTH = width - (MARGIN * 2)
    const { entries } = challenge.member.ranking

    console.log(entries)

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
            backgroundColor: isDark ? colors.brownSugar : colors.mistyRose,
            borderColor: needVote ? 'red' : isDark ? colors.brownSugar : colors.mistyRose,
            borderWidth: 3

        }}>
            <View>
                <Image source={{ uri: `https://photos.gurushots.com/unsafe/500x500/${member.id}/3_${id}.jpg` }} style={{ width: '100%', height: 200 }} />
                <View style={{ position: 'absolute', top: 0, left: 0, width: WIDTH, padding: 6, backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <Text style={{ fontWeight: 'bold', color: colors.isabelline }}>{challenge.title}</Text>
                </View>
            </View>
            <View style={{ flexDirection: 'row', borderBottomLeftRadius: 2, borderBottomRightRadius: 2, overflow: 'hidden', backgroundColor: colors.vividTangerine }}>
                {entries.map((entry) => (
                    <View key={entry.id}>
                        <Image source={{ uri: `https://photos.gurushots.com/unsafe/500x500/${entry.member_id}/3_${entry.id}.jpg` }} style={{ width: WIDTH / 4, height: WIDTH / 4 }} />
                        <View
                            style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                width: WIDTH / 4,
                                padding: 2,
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
                    <Text style={{ fontSize: 12, color: isDark ? colors.isabelline : colors.text }}>Exposure factor: {challenge.member.ranking.exposure.exposure_factor}</Text>
                    <Text style={{ fontSize: 12, color: isDark ? colors.isabelline : colors.text }}>Rank: {memberScore.level_name} ({memberScore.next_message})</Text>
                    <Text style={{ fontSize: 12, color: isDark ? colors.isabelline : colors.text }}>Ends at: {moment.unix(challenge.close_time).format('YYYY-MM-DD HH:MM')}</Text>
                    <Text style={{ fontSize: 12, color: isDark ? colors.isabelline : colors.text }}>Your score: {memberScore.votes} votes</Text>
                </View>

                {challenge.member.ranking.exposure.exposure_factor < 100 && <TouchableOpacity
                    onPress={() => vote()}
                    style={{
                        position: 'absolute',
                        right: 6,
                        bottom: 6,
                        padding: 4,
                        backgroundColor: 'green',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 4
                    }}
                    disabled={isVoting}>
                    <Text style={{
                        color: 'white',
                        fontSize: 10,
                        padding: 4,
                        marginBottom: 2,
                        textAlign: 'center',
                    }}>Vote </Text>
                </TouchableOpacity>}
            </View>
        </View >
    )
}