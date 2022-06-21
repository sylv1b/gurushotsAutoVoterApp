import { View, Text, FlatList, TouchableOpacity, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { fetchChallengesAndVote, getActiveChallenges } from '../utils/gurushotsApi'
import ChallengeCard from '../components/ChallengeCard'
import { useSelector } from 'react-redux'
import colors from '../styles/colors'
import {
    Button
} from '../components/shared'
import LoadingOverlay from '../components/shared/LoadingOverlay/LoadingOverlay'

export default function Home() {
    const { user } = useSelector(state => state.auth)
    const [challenges, setChallenges] = useState({})
    const [hasFetched, setHasFetched] = useState(false)
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [voting, setVoting] = useState(false)
    const [forceRefresh, setForceRefresh] = useState(false)

    useEffect(() => {
        if (!challenges.challenges || forceRefresh) {
            getActiveChallenges(user)
                .then(challenges => {
                    setChallenges(challenges)
                    setLoading(false)
                    setRefreshing(false)
                    setHasFetched(true)
                })
            setForceRefresh(false)
        }
    }, [challenges, forceRefresh])

    const voteToAllChallenges = async () => {
        setVoting(true)
        setLoading(true)
        fetchChallengesAndVote(user).then(res => {
            getActiveChallenges(user).then((challenges) => {
                setChallenges(challenges)
                setLoading(false)
                setVoting(false)
            })
        })
    }

    const header = (
        <View style={{ paddingHorizontal: 8, marginVertical: 12 }}>
            <View style={{ flexDirection: 'row', height: 60, justifyContent: 'space-between', alignItems: 'center', }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'black' }}>
                    {`Active Challenge${challenges?.challenges?.length > 1 ? 's' : ''}`}
                </Text>
            </View>
        </View>
    )

    const footer_ = !loading && (<TouchableOpacity
        style={{ marginVertical: 20, padding: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: loading ? 'grey' : 'coral' }}
        onPress={() => voteToAllChallenges()}
        disabled={loading || refreshing}
    >
        <Text style={{ fontSize: 12, fontWeight: 'bold', color: 'white' }}>
            Vote to all challenges
        </Text>
    </TouchableOpacity>)

    const footer = (
        <View style={{ marginBottom: 40 }}>
            <Button
                text={voting ? 'Voting...' : `Vote to all ${challenges.challenges?.length} challenge${challenges.challenges?.length > 1 ? 's' : ''}`}
                onPress={() => voteToAllChallenges()}
                color={loading || refreshing ? 'rgba(0,0,0,0.5)' : 'black'}
                disabled={loading || refreshing}
            />
        </View>
    )

    if (!hasFetched) {
        return (
            <LoadingOverlay text='Loading challenges...' />
        )
    }

    return (
        <View style={{
            flex: 1,
            backgroundColor: 'black',
        }}>
            {challenges.challenges ? <FlatList
                data={challenges.challenges ? challenges.challenges.sort((a, b) => a.close_time - b.close_time) : []}
                renderItem={({ item }) => <ChallengeCard challenge={item} forceRefresh={(b) => setForceRefresh(b)} />}
                keyExtractor={item => item.id}
                ListFooterComponent={footer}
                refreshControl={<RefreshControl refreshing={refreshing} tintColor={'white'} onRefresh={() => {
                    getActiveChallenges(user).then((challenges) => {
                        setChallenges(challenges)
                        setRefreshing(false)
                    }), setRefreshing(true)
                }} />}
            /> : <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'white' }}>
                    No Active Challenges
                </Text>
                <Text style={{ fontSize: 16, color: 'white', textAlign: 'center' }}>
                    Go to GS app to enroll to challenges, then come back here to vote.
                </Text>
            </View>}
        </View>
    )
}